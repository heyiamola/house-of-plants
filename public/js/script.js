document.addEventListener(
  "DOMContentLoaded",
  () => {
    start();
  },
  false
);

function start() {
  console.log("house-of-plants JS imported successfully!");

  const dropdown = document.querySelector(".nav-dropdown");
  let dropdownMenuMagic;
  console.log("HELLO");
  dropdown?.addEventListener("mouseenter", (e) => {
    if (dropdownMenuMagic) {
      dropdownMenuMagic.classList.add("show-nav");
      return;
    }
    const isUserLoggedIn = document.querySelector(".nav-dropdown-menu");
    if (!isUserLoggedIn) {
      return;
    }
    dropdownMenuMagic = isUserLoggedIn;
    dropdownMenuMagic.classList.add("show-nav");
  });
  dropdown?.addEventListener("mouseleave", () => {
    console.log("BYE BYE BYE");
    if (!dropdownMenuMagic) {
      return;
    }
    dropdownMenuMagic.classList.remove("show-nav");
  });
}
