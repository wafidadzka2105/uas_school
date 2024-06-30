document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://130.162.195.228/mhs714220014/mahasiswa";
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
      const tableBody = document.querySelector("#table-mahasiswa tbody");

      data.forEach((mahasiswa) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
                        <td class="text-truncate">${mahasiswa.npm}</td>
                        <td>
                            <h6 class="mb-0 text-truncate">${mahasiswa.nama}</h6>
                        </td>
                        <td class="text-truncate">
                        ${mahasiswa.kelas}
                        </td>
                        <td class="text-truncate">${mahasiswa.alamat}</td>
                        <td class="text-truncate">
                            <button class="btn btn-warning" onclick="return window.location.href='./ubah-mahasiswa.html?id=${mahasiswa.npm}'" >Ubah</button> |
                            <button class="btn btn-danger delete-btn" data-id="${mahasiswa.npm}">Hapus</button>
                        </td>
              `;
      });

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const npmMahasiswa = this.getAttribute("data-id");
          deleteCategory(npmMahasiswa);
          console.log(npmMahasiswa);
        });
      });
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
    });

  // Function to delete a category
  function deleteCategory(npmMahasiswa) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${apiUrl}/${npmMahasiswa}`, {
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
            Swal.fire("Deleted!", "Category has been deleted.", "success");
            // Remove the category row from the table
            document.querySelector(`button[data-id="${npmMahasiswa}"]`).closest("tr").remove();
          })
          .catch((error) => {
            Swal.fire("Error!", "There has been a problem with your fetch operation.", "error");
            console.error("There has been a problem with your fetch operation:", error);
          });
      }
    });
  }

  document.getElementById("logoutButton").addEventListener("click", function (event) {
    event.preventDefault();
    logout();
  });
});
