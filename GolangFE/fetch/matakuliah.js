document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = "https://130.162.195.228/mhs714220014/matakuliah";
    const userLogin = document.getElementById("user-login");
    // Function to decode JWT token
    function parseJwt(token) {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
  
        return JSON.parse(jsonPayload);
      } catch (e) {
        return {};
      }
    }
  
    // Get the token from cookie (assuming it's already set)
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      .split("=")[1];
      
    // Fetch and display categories
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const tableBody = document.querySelector("#table-matakuliah tbody");
  
        data.forEach((matakuliah, index) => {
          const row = tableBody.insertRow();
          row.innerHTML = `
                            <td class="text-truncate">${index + 1}</td>
                            <td>
                                <h6 class="mb-0 text-truncate">${matakuliah.matakuliah}</h6>
                            </td>
                            <td class="text-truncate">
                            ${matakuliah.dosen}
                            </td>
                  `;
        });
  
        // Add event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach((button) => {
          button.addEventListener("click", function () {
            const categoryId = this.getAttribute("data-id");
            deleteCategory(categoryId);
          });
        });
      })
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
      });
  
    // Function to delete a category
    function deleteCategory(categoryId) {
      if (confirm("Are you sure you want to delete this category?")) {
        fetch(`${apiUrl}/${categoryId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            alert("Category deleted successfully");
            // Remove the category row from the table
            document.querySelector(`button[data-id="${categoryId}"]`).closest("tr").remove();
          })
          .catch((error) => {
            console.error("There has been a problem with your fetch operation:", error);
          });
      }
    }
  
    document.getElementById("logoutButton").addEventListener("click", function (event) {
      event.preventDefault();
      logout();
    });
  });
  