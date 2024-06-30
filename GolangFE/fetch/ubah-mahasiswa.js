function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://130.162.195.228/mhs714220014/mahasiswa";
  const mahasiswaForm = document.getElementById("mahasiswaForm");
  const urlParams = new URLSearchParams(window.location.search);
  const npmUrl = urlParams.get("id");
  const token = getCookie("token"); // Mengambil token dari cookie

  // Fetch category details
  fetch(`${apiUrl}/${npmUrl}`, {
    method: "GET",
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
      console.log(data); // Debugging line to check the response data
      if (data.npm && data.nama && data.kelas && data.alamat) {
        document.getElementById("npm").value = data.npm || "";
        document.getElementById("nama").value = data.nama || "";
        document.getElementById("kelas").value = data.kelas || "";
        document.getElementById("alamat").value = data.alamat || "";
      } else {
        console.error("Invalid data structure:", data);
      }
    })

    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);
    });

  mahasiswaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mahasiswaData = {
        npm : document.getElementById("npm").value,
        nama : document.getElementById("nama").value,
        kelas : document.getElementById("kelas").value,
        alamat : document.getElementById("alamat").value,
    };
    console.log(JSON.stringify(mahasiswaData));

    fetch(`${apiUrl}/${npmUrl}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mahasiswaData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: data.message,
          showConfirmButton: true,
        }).then(() => {
          window.location.href = "./mahasiswa.html";
        });
      })
      .catch((error) => {
        console.error("There has been a problem with your fetch operation:", error);
      });
  });
});
