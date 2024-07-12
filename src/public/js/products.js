document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".deleteButton");
  const addButton = document.querySelectorAll(".addButton");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productId = button.getAttribute("data-id");
      const confirmDelete = confirm(
        "¿Estás seguro de que deseas eliminar este producto?"
      );

      if (confirmDelete) {
        try {
          const response = await fetch(`/productsManager/${productId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            alert("Producto eliminado exitosamente");
            button.parentElement.remove();
          } else {
            alert("Error al eliminar el producto");
          }
        } catch (error) {
          alert("Error de red al intentar eliminar el producto");
        }
      }
    });
  });
});
