import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Package,
  Plus,
  RefreshCw,
  UtensilsCrossed,
} from "lucide-react";
import Logo from "../components/layout/Logo";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import MealItemCard from "../components/catalog/MealItemCard";
import MealCard from "../components/catalog/MealCard";
import MealItemModal from "../components/catalog/MealItemModal";
import MealModal from "../components/catalog/MealModal";
import DeleteConfirmModal from "../components/catalog/DeleteConfirmModal";
import CatalogPagination from "../components/catalog/CatalogPagination";
import { mealItemService } from "../services/mealItemService";
import { mealService } from "../services/mealService";

const PAGE_SIZE = 9; // 3x3 grid looks great on desktop

export default function VendorCatalogPage() {
  const [activeTab, setActiveTab] = useState("items"); // "items" | "meals"

  // Meal Items State
  const [mealItemsPage, setMealItemsPage] = useState(null);
  const [mealItemsCurrentPage, setMealItemsCurrentPage] = useState(0);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemsError, setItemsError] = useState("");

  // Meals State
  const [mealsPage, setMealsPage] = useState(null);
  const [mealsCurrentPage, setMealsCurrentPage] = useState(0);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const [mealsError, setMealsError] = useState("");

  // Modals state
  const [isMealItemModalOpen, setIsMealItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); // { type: "item" | "meal", data: Object }
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Notification banner
  const [notification, setNotification] = useState("");

  // Fetch Meal Items
  const loadMealItems = async (page = 0) => {
    setLoadingItems(true);
    setItemsError("");
    try {
      const data = await mealItemService.getMealItems({ page, size: PAGE_SIZE });
      setMealItemsPage(data);
      setMealItemsCurrentPage(page);
    } catch (err) {
      setItemsError(
        err.status === 403
          ? "Vendor permission required to access meal items."
          : err.message || "Failed to load meal items."
      );
    } finally {
      setLoadingItems(false);
    }
  };

  // Fetch Meals
  const loadMeals = async (page = 0) => {
    setLoadingMeals(true);
    setMealsError("");
    try {
      const data = await mealService.getMeals({ page, size: PAGE_SIZE });
      setMealsPage(data);
      setMealsCurrentPage(page);
    } catch (err) {
      setMealsError(
        err.status === 403
          ? "Vendor permission required to access meals."
          : err.message || "Failed to load meals."
      );
    } finally {
      setLoadingMeals(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadMealItems(0);
    loadMeals(0);
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? "" : curr));
    }, 4000);
  };

  // Handlers for Meal Items
  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setIsMealItemModalOpen(true);
  };

  const handleOpenEditItem = (item) => {
    setEditingItem(item);
    setIsMealItemModalOpen(true);
  };

  const handleItemSuccess = (msg) => {
    showNotification(msg);
    loadMealItems(mealItemsCurrentPage);
  };

  // Handlers for Meals
  const handleOpenCreateMeal = () => {
    setEditingMeal(null);
    setIsMealModalOpen(true);
  };

  const handleOpenEditMeal = (meal) => {
    setEditingMeal(meal);
    setIsMealModalOpen(true);
  };

  const handleMealSuccess = (msg) => {
    showNotification(msg);
    loadMeals(mealsCurrentPage);
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === "item") {
        await mealItemService.deleteMealItem(deleteTarget.data.id);
        showNotification(`"${deleteTarget.data.name}" deleted successfully.`);
        // Reload meal items and meals (since meals might use this item)
        await Promise.all([loadMealItems(mealItemsCurrentPage), loadMeals(mealsCurrentPage)]);
      } else {
        await mealService.deleteMeal(deleteTarget.data.id);
        showNotification(`"${deleteTarget.data.name}" deleted successfully.`);
        await loadMeals(mealsCurrentPage);
      }
      setDeleteTarget(null);
    } catch (err) {
      showNotification(`Failed to delete: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const mealItemsList = mealItemsPage?.content || [];
  const mealsList = mealsPage?.content || [];

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-6 px-4 py-8 sm:px-8">
      {/* Top Header */}
      <header className="flex flex-col gap-6 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4">
          <Logo />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-lime-600">
              Vendor Workspace
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">Meal Catalog</h1>
            <p className="mt-1 text-sm text-ink-soft">
              Manage your meal items and meals
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleOpenCreateItem}
            className="flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Meal Item
          </Button>

          <Button
            type="button"
            onClick={handleOpenCreateMeal}
            className="flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Meal
          </Button>
        </div>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div
          role="status"
          className="flex items-center gap-3 rounded-2xl bg-lime-100 p-4 text-sm font-bold text-ink shadow-neu-sm transition-all animate-in fade-in"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-lime-600" aria-hidden="true" />
          <p>{notification}</p>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-ink/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("items")}
          className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-200 ${
            activeTab === "items"
              ? "bg-lime-400 text-ink shadow-neu-sm"
              : "bg-surface text-ink-soft shadow-neu-sm hover:text-ink active:shadow-neu-pressed"
          }`}
        >
          <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
          Meal Items
          {mealItemsPage?.totalElements != null && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                activeTab === "items" ? "bg-ink text-surface" : "bg-ink/10 text-ink"
              }`}
            >
              {mealItemsPage.totalElements}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("meals")}
          className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all duration-200 ${
            activeTab === "meals"
              ? "bg-lime-400 text-ink shadow-neu-sm"
              : "bg-surface text-ink-soft shadow-neu-sm hover:text-ink active:shadow-neu-pressed"
          }`}
        >
          <Package className="h-4 w-4" aria-hidden="true" />
          Meals
          {mealsPage?.totalElements != null && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                activeTab === "meals" ? "bg-ink text-surface" : "bg-ink/10 text-ink"
              }`}
            >
              {mealsPage.totalElements}
            </span>
          )}
        </button>
      </div>

      {/* CONTENT AREA */}
      <Card className="min-h-[420px]">
        {/* Tab 1: Meal Items Content */}
        {activeTab === "items" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-ink">Previously created Meal Items</h2>
                <p className="text-xs text-ink-soft">
                  Individual dishes and components included in your meals
                </p>
              </div>
              <button
                type="button"
                onClick={() => loadMealItems(mealItemsCurrentPage)}
                aria-label="Refresh meal items"
                className="rounded-xl p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink active:shadow-neu-pressed"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loadingItems ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {loadingItems && (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-ink-soft">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-lime-600 border-t-transparent" />
                <p>Loading meal items...</p>
              </div>
            )}

            {!loadingItems && itemsError && (
              <div className="space-y-4 py-8 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                  <AlertCircle className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-danger">{itemsError}</p>
                <Button variant="secondary" onClick={() => loadMealItems(mealItemsCurrentPage)}>
                  Try again
                </Button>
              </div>
            )}

            {!loadingItems && !itemsError && mealItemsList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-surface shadow-neu">
                  <UtensilsCrossed className="h-8 w-8 text-ink-soft" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-ink">No meal items yet</h3>
                <p className="mt-1 max-w-sm text-xs text-ink-soft">
                  Create your individual food items (like Dal, Roti, Rice, Paneer Curry) to start
                  assembling meals.
                </p>
                <div className="mt-6">
                  <Button onClick={handleOpenCreateItem}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create First Meal Item
                  </Button>
                </div>
              </div>
            )}

            {!loadingItems && !itemsError && mealItemsList.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mealItemsList.map((item) => (
                    <MealItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleOpenEditItem}
                      onDelete={(target) => setDeleteTarget({ type: "item", data: target })}
                    />
                  ))}
                </div>

                <CatalogPagination
                  currentPage={mealItemsCurrentPage}
                  totalPages={mealItemsPage?.totalPages || 0}
                  totalElements={mealItemsPage?.totalElements || 0}
                  onPageChange={(p) => loadMealItems(p)}
                />
              </>
            )}
          </div>
        )}

        {/* Tab 2: Meals Content */}
        {activeTab === "meals" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-ink">Previously created Meals</h2>
                <p className="text-xs text-ink-soft">
                  Complete tiffin sets composed of your meal items
                </p>
              </div>
              <button
                type="button"
                onClick={() => loadMeals(mealsCurrentPage)}
                aria-label="Refresh meals"
                className="rounded-xl p-2 text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink active:shadow-neu-pressed"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loadingMeals ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </div>

            {loadingMeals && (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-ink-soft">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-lime-600 border-t-transparent" />
                <p>Loading meals...</p>
              </div>
            )}

            {!loadingMeals && mealsError && (
              <div className="space-y-4 py-8 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-danger/10 text-danger">
                  <AlertCircle className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-danger">{mealsError}</p>
                <Button variant="secondary" onClick={() => loadMeals(mealsCurrentPage)}>
                  Try again
                </Button>
              </div>
            )}

            {!loadingMeals && !mealsError && mealsList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-surface shadow-neu">
                  <Package className="h-8 w-8 text-ink-soft" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-ink">No meals created yet</h3>
                <p className="mt-1 max-w-sm text-xs text-ink-soft">
                  Bundle your meal items into complete meals (like Regular Lunch or Special Dinner)
                  ready to be offered in daily menus.
                </p>
                <div className="mt-6">
                  <Button onClick={handleOpenCreateMeal}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create First Meal
                  </Button>
                </div>
              </div>
            )}

            {!loadingMeals && !mealsError && mealsList.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {mealsList.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onEdit={handleOpenEditMeal}
                      onDelete={(target) => setDeleteTarget({ type: "meal", data: target })}
                    />
                  ))}
                </div>

                <CatalogPagination
                  currentPage={mealsCurrentPage}
                  totalPages={mealsPage?.totalPages || 0}
                  totalElements={mealsPage?.totalElements || 0}
                  onPageChange={(p) => loadMeals(p)}
                />
              </>
            )}
          </div>
        )}
      </Card>

      {/* Create / Edit Meal Item Modal */}
      {isMealItemModalOpen && (
        <MealItemModal
          isOpen={isMealItemModalOpen}
          onClose={() => setIsMealItemModalOpen(false)}
          onSuccess={handleItemSuccess}
          initialItem={editingItem}
        />
      )}

      {/* Create / Edit Meal Modal */}
      {isMealModalOpen && (
        <MealModal
          isOpen={isMealModalOpen}
          onClose={() => setIsMealModalOpen(false)}
          onSuccess={handleMealSuccess}
          initialMeal={editingMeal}
          preloadedMealItems={mealItemsList}
          onRequestCreateItem={handleOpenCreateItem}
        />
      )}

      {/* Confirmation Dialog for Deletions */}
      {deleteTarget && (
        <DeleteConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title={deleteTarget.type === "item" ? "Delete Meal Item" : "Delete Meal"}
          itemName={deleteTarget.data.name}
          itemType={deleteTarget.type === "item" ? "meal item" : "meal"}
          isDeleting={isDeleting}
        />
      )}
    </main>
  );
}
