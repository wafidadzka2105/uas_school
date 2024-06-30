function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

document.getElementById("mahasiswaForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  // Ambil data dari form
  const npm = document.getElementById("npm").value;
  const nama = document.getElementById("nama").value;
  const kelas = document.getElementById("kelas").value;
  const alamat = document.getElementById("alamat").value;
  const token = getCookie("token"); // Mengambil token dari cookie

  // Buat payload untuk dikirim ke API
  const data = {
    npm: npm,
    nama: nama,
    kelas: kelas,
    alamat: alamat,
  };

  console.log(JSON.stringify(data));

  try {
    const response = await fetch("https://130.162.195.228/mhs714220014/mahasiswa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Menggunakan token dari cookie
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      console.log("Response JSON:", result);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: result.message,
          showConfirmButton: true,
        }).then(() => {
          // Redirect to another page after login
          window.location.href = "./mahasiswa.html"; // Ubah ke halaman yang diinginkan
        });
      } else {
        alert(`Error: ${result.message}`);
      }
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      alert(`Error: ${text}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while adding the Mahasiswa.");
  }
});
