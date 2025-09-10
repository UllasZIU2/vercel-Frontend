import { X, Search } from "lucide-react";
import { formatPrice } from "../../utils/constants";

const ComponentModal = ({
  activeModal,
  loading,
  searchTerm,
  setSearchTerm,
  closeModal,
  getComponentName,
  filteredProducts,
  handleComponentSelect,
  selectedProductIdsMap,
  onRemoveComponent,
}) => {
  if (!activeModal) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            Select a {getComponentName(activeModal)}
          </h3>
          <button
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center rounded-lg border px-3 py-1">
            <Search size={20} className="mr-2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search for ${getComponentName(activeModal)}...`}
              className="flex-1 border-none bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="my-8 flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="my-8 text-center">
            <p className="text-gray-500">
              No {getComponentName(activeModal)} components found.
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-x-auto">
            <table className="table">
              <thead className="bg-base-100 sticky top-0 z-10">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const isAlreadySelected =
                    selectedProductIdsMap?.[product._id] || false;

                  return (
                    <tr
                      key={product._id}
                      className={isAlreadySelected ? "bg-base-200" : ""}
                    >
                      <td className="min-w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <img src={product.image} alt={product.modelNo} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{product.modelNo}</div>
                            <div className="line-clamp-1 text-sm opacity-70">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">
                          {formatPrice(
                            product.onDiscount
                              ? product.discountPrice
                              : product.price,
                          )}
                        </div>
                        {product.onDiscount && (
                          <span className="text-sm line-through opacity-60">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </td>
                      <td>
                        {isAlreadySelected ? (
                          <button
                            className="btn btn-error btn-sm w-24"
                            onClick={() =>
                              onRemoveComponent &&
                              onRemoveComponent(activeModal)
                            }
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm w-24"
                            onClick={() =>
                              handleComponentSelect(activeModal, product)
                            }
                          >
                            Select
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={closeModal}></div>
    </div>
  );
};

export default ComponentModal;
