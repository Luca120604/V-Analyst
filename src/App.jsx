import { useState } from "react";
import Home from "./pages/Home.jsx";
import NewItem from "./pages/NewItem.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";
import Settings from "./pages/Settings.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useTheme } from "./hooks/useTheme.js";
import { SEED_ITEMS } from "./data/seedItems.js";
import { nextItemId, normalizeItem } from "./lib/schema.js";

export default function App() {
  useTheme();
  const [items, setItems] = useLocalStorage("vh.items", () => SEED_ITEMS);
  const [modelChoice, setModelChoice] = useLocalStorage("vh.model", "flash");
  const [tab, setTab] = useState("home");
  const [openItemId, setOpenItemId] = useState(null);

  const openItem = items.find((i) => i.item_id === openItemId);

  function saveItem(updated) {
    const normalized = normalizeItem(updated, updated.item_id);
    setItems((prev) => prev.map((i) => (i.item_id === normalized.item_id ? normalized : i)));
  }

  function createItem(draft) {
    const id = nextItemId(items);
    const normalized = normalizeItem({ ...draft, item_id: id }, id);
    setItems((prev) => [normalized, ...prev]);
    setTab("home");
    setOpenItemId(id);
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((i) => i.item_id !== id));
    setOpenItemId(null);
  }

  function resetSeed() {
    if (!confirm("Aktuelle Artikel mit Demo-Daten überschreiben?")) return;
    setItems(SEED_ITEMS);
    setOpenItemId(null);
  }

  function clearAll() {
    setItems([]);
    setOpenItemId(null);
  }

  let body;
  if (openItem) {
    body = (
      <ItemDetail
        item={openItem}
        onBack={() => setOpenItemId(null)}
        onSave={saveItem}
        onDelete={deleteItem}
      />
    );
  } else if (tab === "home") {
    body = (
      <Home
        items={items}
        onOpen={(id) => setOpenItemId(id)}
        onAdd={() => setTab("new")}
      />
    );
  } else if (tab === "new") {
    body = (
      <NewItem
        nextId={nextItemId(items)}
        modelChoice={modelChoice}
        onCancel={() => setTab("home")}
        onCreate={createItem}
      />
    );
  } else if (tab === "settings") {
    body = (
      <Settings
        items={items}
        onResetSeed={resetSeed}
        onClearAll={clearAll}
        modelChoice={modelChoice}
        setModelChoice={setModelChoice}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <main
        className="max-w-3xl mx-auto px-4 pt-4"
        style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}
      >
        {body}
      </main>
      <BottomNav
        active={openItem ? "home" : tab}
        onChange={(id) => {
          setOpenItemId(null);
          setTab(id);
        }}
      />
    </div>
  );
}
