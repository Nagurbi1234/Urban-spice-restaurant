import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PageFrame from "../components/PageFrame";
import DishCard from "../components/DishCard";
import { LoadingBlock, ErrorBlock } from "../components/StateBlocks";
import { useFetch } from "../hooks/useApi";
import * as menuService from "../services/menuService";
import { fallbackMenu } from "../utils/format";

const categories = ["All", "Indian", "Chinese", "Continental", "Starters", "Main Course", "Desserts", "Beverages"];

export default function MenuPage() {
  const query = useFetch(() => menuService.getMenu(), []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [veg, setVeg] = useState(false);
  const [sort, setSort] = useState("popular");

  const source = query.data ?? fallbackMenu;

  const filtered = useMemo(() => {
    return source
      .filter(
        (item) =>
          (category === "All" || item.category === category) &&
          (!veg || item.isVegetarian) &&
          `${item.name} ${item.description}`.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        return (b.rating ?? 0) - (a.rating ?? 0);
      });
  }, [source, category, veg, search, sort]);

  return (
    <PageFrame
      eyebrow="The menu"
      title="Good food, with a point of view."
      intro="A cross-city menu of bright spices, careful fire and things we’d order for ourselves. Browse by mood, appetite or price."
    >
      <div className="menu-toolbar">
        <div className="category-pills">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`category-pill${category === item ? " active" : ""}`}
              data-testid={`button-category-${item.toLowerCase()}`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="menu-filters">
          <label className="checkbox-label">
            <input
              checked={veg}
              onChange={(event) => setVeg(event.target.checked)}
              type="checkbox"
              data-testid="input-vegetarian"
            />
            Vegetarian
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="select-input"
            data-testid="select-sort"
          >
            <option value="popular">Most loved</option>
            <option value="price-low">Price: low first</option>
            <option value="price-high">Price: high first</option>
          </select>
        </div>
      </div>

      <div className="search-wrap">
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search curries, noodles, something sweet…"
          className="search-input"
          data-testid="input-menu-search"
        />
      </div>

      {query.isLoading ? (
        <div className="grid-auto-3 menu-grid">
          <LoadingBlock />
          <LoadingBlock />
          <LoadingBlock />
        </div>
      ) : query.isError && !source.length ? (
        <div className="menu-grid">
          <ErrorBlock onRetry={() => query.refetch()} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="dashed-box menu-grid" data-testid="empty-menu">
          <p className="font-display" style={{ fontSize: 30, color: "var(--color-brown-deep)" }}>
            Nothing on this page yet.
          </p>
          <p>Try a different craving.</p>
        </div>
      ) : (
        <div className="grid-auto-3 menu-grid">
          {filtered.map((item) => (
            <DishCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </PageFrame>
  );
}
