import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../../stores/useProductStore";
import { useCartStore } from "../../stores/useCartStore";
import {
  ArrowLeft,
  Info,
  Cpu,
  Monitor,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  categoryMappings as componentCategoryMapping,
  componentNames,
} from "../../components/BuildPC/componentUtils";

// Import modularized components
import BudgetSelector from "../../components/PreBuiltPC/BudgetSelector";
import CustomBudgetForm from "../../components/PreBuiltPC/CustomBudgetForm";
import PCConfigurationCard from "../../components/PreBuiltPC/PCConfigurationCard";
import {
  budgetRanges,
  typeDescriptions,
  generateConfigurations,
  generateCustomConfiguration,
} from "../../components/PreBuiltPC/configurationUtils";

const PreBuiltPCPage = () => {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCartStore();

  // State management
  const [selectedType, setSelectedType] = useState("gaming");
  const [selectedBudgetRange, setSelectedBudgetRange] = useState("budget");
  const [configurations, setConfigurations] = useState({});
  const [addingToCartId, setAddingToCartId] = useState(null);
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [customBudget, setCustomBudget] = useState(1000);
  const [customConfiguration, setCustomConfiguration] = useState(null);
  const [isGeneratingCustomBuild, setIsGeneratingCustomBuild] = useState(false);

  // Component display names from BuildPC utils
  const componentDisplayNames = componentNames;

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Generate the configurations based on products and selected type/budget
  useEffect(() => {
    if (!products || loading) return;

    const configs = generateConfigurations(products, componentCategoryMapping);
    setConfigurations(configs);
  }, [products, loading]);

  // Function to generate a custom budget configuration
  const handleGenerateCustomConfiguration = () => {
    if (!products || products.length === 0 || customBudget <= 0) return;

    setIsGeneratingCustomBuild(true);

    try {
      const config = generateCustomConfiguration({
        products,
        customBudget,
        selectedType,
        componentCategoryMapping,
      });

      setCustomConfiguration(config);
      toast.success(`Custom build created for ৳${customBudget} budget!`);
    } catch (error) {
      console.error("Error generating custom build:", error);
      toast.error("Failed to generate custom build");
    } finally {
      setIsGeneratingCustomBuild(false);
    }
  };

  // Handle adding a custom build to cart
  const handleAddCustomToCart = async () => {
    if (!customConfiguration) return;

    setAddingToCartId("custom");

    try {
      // Add each component to cart
      for (const [_, component] of Object.entries(
        customConfiguration.components,
      )) {
        if (component) {
          await addToCart(component._id, 1);
        }
      }
      toast.success("Custom PC build added to cart!");
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (error) {
      toast.error("Failed to add custom PC build to cart");
      console.error("Error adding custom PC to cart:", error);
    } finally {
      setAddingToCartId(null);
    }
  };

  // Handle adding a complete build to cart
  const handleAddToCart = async (pcType, budgetRange) => {
    const config = configurations[pcType]?.[budgetRange];
    if (!config) return;

    setAddingToCartId(`${pcType}-${budgetRange}`);

    try {
      // Add each component to cart
      for (const [_, component] of Object.entries(config.components)) {
        if (component) {
          await addToCart(component._id, 1);
        }
      }
      toast.success("Pre-built PC added to cart!");
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (error) {
      toast.error("Failed to add PC build to cart");
      console.error("Error adding pre-built PC to cart:", error);
    } finally {
      setAddingToCartId(null);
    }
  };

  // PC type icons for the hero section
  const pcTypeIcons = {
    gaming: <Cpu size={28} className="text-primary" />,
    productivity: <Wrench size={28} className="text-primary" />,
    regular: <Monitor size={28} className="text-primary" />,
  };

  return (
    <main className="min-h-screen">
      <header className="bg-base-200 mb-8 rounded-xl py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="from-primary via-secondary to-info mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-widest text-transparent uppercase">
              Pre-Built PCs
            </h1>
            <p className="text-base-content/70 mx-auto mt-3 max-w-2xl text-lg">
              Choose from our professionally designed custom PC builds based on
              your budget and needs
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-3">
            {Object.entries(typeDescriptions).map(([type, description]) => (
              <article
                key={type}
                className={`card bg-base-100 cursor-pointer shadow-lg transition-all hover:shadow-xl ${
                  selectedType === type ? "border-primary border-2" : ""
                }`}
                onClick={() => setSelectedType(type)}
              >
                <div className="card-body items-center p-6 text-center">
                  <div className="bg-base-200 mb-3 rounded-full p-4">
                    {pcTypeIcons[type]}
                  </div>
                  <h2 className="card-title text-lg capitalize">
                    {type === "regular" ? "Home/Office" : type}
                  </h2>
                  <p className="text-base-content/70 text-sm">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </header>

      <section className="bg-base-200 mx-auto rounded-xl px-4 py-8">
        {/* Budget Selector Component */}
        <BudgetSelector
          isCustomBudget={isCustomBudget}
          setIsCustomBudget={setIsCustomBudget}
          selectedBudgetRange={selectedBudgetRange}
          setSelectedBudgetRange={setSelectedBudgetRange}
          budgetRanges={budgetRanges}
          selectedType={selectedType}
        />

        {/* Configuration Display Section */}
        {loading ? (
          <div
            className="flex flex-col items-center justify-center py-16"
            aria-live="polite"
            aria-busy="true"
          >
            <LoadingSpinner size="lg" />
            <p className="text-base-content/70 mt-4">
              Generating optimal configurations...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Custom Budget Form and Configuration */}
            {isCustomBudget && (
              <div className="animate-fadeIn">
                <CustomBudgetForm
                  customBudget={customBudget}
                  setCustomBudget={setCustomBudget}
                  generateCustomConfiguration={
                    handleGenerateCustomConfiguration
                  }
                  isGeneratingCustomBuild={isGeneratingCustomBuild}
                  selectedType={selectedType}
                />

                {customConfiguration && (
                  <div className="mt-8">
                    <PCConfigurationCard
                      pcType={selectedType}
                      budgetRange="custom"
                      configuration={customConfiguration}
                      budgetRangeName={customConfiguration.name}
                      isCustom={true}
                      targetBudget={customBudget}
                      onAddToCart={handleAddCustomToCart}
                      addingToCartId={addingToCartId}
                      componentDisplayNames={componentDisplayNames}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Predefined Budget Configuration */}
            {!isCustomBudget &&
            configurations[selectedType]?.[selectedBudgetRange] ? (
              <div className="animate-fadeIn">
                <PCConfigurationCard
                  pcType={selectedType}
                  budgetRange={selectedBudgetRange}
                  configuration={
                    configurations[selectedType][selectedBudgetRange]
                  }
                  budgetRangeName={
                    budgetRanges[selectedType][selectedBudgetRange].name
                  }
                  description={
                    selectedType === "gaming"
                      ? "Optimized for gaming performance with powerful graphics cards and processors"
                      : selectedType === "productivity"
                        ? "Optimized for professional workflows with multi-core processing and reliable components"
                        : "Optimized for everyday computing needs with balanced performance and value"
                  }
                  onAddToCart={handleAddToCart}
                  addingToCartId={addingToCartId}
                  componentDisplayNames={componentDisplayNames}
                />
              </div>
            ) : (
              !isCustomBudget && (
                <div
                  className="py-16 text-center"
                  role="alert"
                  aria-live="polite"
                >
                  <div className="mb-6 flex justify-center">
                    <Info size={64} className="text-base-content/30" />
                  </div>
                  <h3 className="text-2xl font-semibold">
                    No Configuration Available
                  </h3>
                  <p className="mx-auto mt-3 max-w-lg">
                    We couldn't generate a configuration for this selection.
                    Please try a different budget range or PC type.
                  </p>
                </div>
              )
            )}

            <aside className="mx-auto flex max-w-md flex-col items-center justify-center gap-1 py-4 text-center md:max-w-3xl">
              <p className="font-medium">
                Looking for more customization? Visit our PC Builder page to
                create a completely custom build.
              </p>
              <p className="text-base-content/70 mt-1 text-sm">
                Select each component individually for maximum control over your
                PC build
              </p>
              <Link
                to="/build-pc"
                className="text-primary text-md mt-2 flex items-center gap-2 transition-all hover:scale-105 hover:transform"
              >
                Go to Builder <ArrowRight className="h-5 w-5" />
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
};

export default PreBuiltPCPage;
