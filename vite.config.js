import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // Sikrer at alle filbaner blir relative
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        login: "./login.html",
        profile: "./profile.html",
        register: "./register.html",
        auctionDetail: "./auction-detail.html",
        createAuction: "./create-auction.html",
        editListing: "./edit-listing.html",
      },
    },
  },
});
