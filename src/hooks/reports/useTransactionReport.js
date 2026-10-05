
import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { getOrders } from "../../services/orderService";
import { getPurchase } from "../../services/purchaseService";
import { getProducts } from "../../services/productService";
import { num, pick, findDate, asDate } from "../../utils/Reporthelpers";

const CONFIG = {
  sales: {
    load: getOrders,
    noFields: ["orderNo", "orderNumber", "invoiceNo"],
    dateFields: ["orderDate", "date", "createdAt"],
    // party = customer
    partyCollection: "customers",
    partyNameFields: ["customerName", "customer", "partyName", "name"],
    partyIdFields: ["customerId", "customer_id", "customerID", "partyId", "customer"],
    priceFields: ["price", "salePrice", "sellingPrice", "unitPrice"],
  },
  purchases: {
    load: getPurchase,
    noFields: ["purchaseNo", "invoiceNo"],
    dateFields: ["purchaseDate", "date", "createdAt"],
    // party = supplier (your collection is named "supplier")
    partyCollection: "supplier",
    partyNameFields: ["supplierName", "supplier", "partyName", "name"],
    partyIdFields: ["supplierId", "supplier_id", "supplierID", "partyId", "supplier"],
    priceFields: ["purchasePrice", "price", "costPrice"],
  },
};

const NAME_FIELDS = ["name", "fullName", "customerName", "supplierName", "companyName", "title"];

const readAll = async (name) => {
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export function useTransactionReport(kind) {
  const cfg = CONFIG[kind];
  const [docs, setDocs] = useState([]);
  const [products, setProducts] = useState([]);
  const [parties, setParties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [list, prods, partyList] = await Promise.all([
        cfg.load(),
        getProducts(),
        readAll(cfg.partyCollection).catch(() => []), // don't break the report if this fails
      ]);
      setDocs(list);
      setProducts(prods);
      setParties(partyList);

    } catch (err) {
      console.error(`Failed to load ${kind} report:`, err);
      setError("Failed to load report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [cfg, kind]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const records = useMemo(() => {
    const productName = {};
    products.forEach((p) => {
      productName[p.id] = pick(p, ["name", "productName", "title"]);
    });

    const partyName = {};
    parties.forEach((p) => {
      partyName[p.id] = pick(p, NAME_FIELDS);
    });

    // Works whether the field holds a name string, an id string, or an object
    const resolveParty = (doc) => {
      // 1) a stored name that isn't just an id
      for (const f of cfg.partyNameFields) {
        const v = doc?.[f];
        if (v && typeof v === "object") {
          const n = pick(v, NAME_FIELDS);
          if (n) return n;
        } else if (v && !partyName[v] === false) {
          // value is actually an id we know -> use its name
          return partyName[v];
        } else if (typeof v === "string" && v.trim()) {
          return v;
        }
      }
      // 2) an id we can look up
      for (const f of cfg.partyIdFields) {
        const v = doc?.[f];
        const id = v && typeof v === "object" ? v.id : v;
        if (id && partyName[id]) return partyName[id];
      }
      return "Unknown";
    };

    return docs.map((doc) => {
      const lines = (doc.items || []).map((i) => {
        const qty = num(pick(i, ["quantity", "qty"]));
        const amountField = pick(i, ["amount", "lineTotal", "total"]);
        const amount =
          amountField !== undefined
            ? num(amountField)
            : qty * num(pick(i, cfg.priceFields));
        return {
          productName:
            pick(i, ["productName", "name"]) ||
            productName[i.productId] ||
            "Unknown product",
          qty,
          amount,
        };
      });

      const linesTotal = lines.reduce((s, l) => s + l.amount, 0);
      const t = pick(doc, ["grandTotal", "totalAmount", "total"]);
      const total = t !== undefined ? num(t) : linesTotal;

      const paidRaw = pick(doc, ["amountPaid", "paidAmount", "paid"]);
      const balRaw = pick(doc, ["balance", "balanceDue"]);
      const paid = paidRaw !== undefined ? num(paidRaw) : null;
      const balance =
        balRaw !== undefined ? num(balRaw) : paid !== null ? total - paid : null;

      return {
        id: doc.id,
        no: pick(doc, cfg.noFields) || "",
        date: asDate(findDate(doc, cfg.dateFields)),
        party: resolveParty(doc),
        lines,
        qty: lines.reduce((s, l) => s + l.qty, 0),
        total,
        paid,
        balance,
      };
    });
  }, [docs, products, parties, cfg]);

  return { records, isLoading, error, refetch };
}