document.addEventListener("DOMContentLoaded", function () {
  // Ambil URL saat ini
  var currentUrl = window.location.pathname.split("/").pop();

  // Mapping URL ke ID menu
  var menuMapping = {
    "dashboard.html": "sub-menu-wellcome",
    "mahasiswa.html": "menu-mahasiswa",
    "matakuliah.html": "menu-matakuliah",
  };

  // Dapatkan ID menu yang sesuai dengan URL saat ini
  var activeMenuId = menuMapping[currentUrl];

  if (activeMenuId) {
    // Tambahkan kelas "active" pada item menu yang sesuai
    var activeMenuItem = document.getElementById(activeMenuId);
    if (activeMenuItem) {
      activeMenuItem.classList.add("active");
      // Jika item menu memiliki parent (misalnya menu-sub), tambahkan kelas "open" pada parent-nya
      var parentMenu = activeMenuItem.closest(".menu-item.menu-toggle");
      if (parentMenu) {
        parentMenu.classList.add("open");
        // Tambahkan juga kelas "active" pada menu utama jika item berada dalam submenu
        parentMenu.classList.add("active");
      }
    }
  }
});
