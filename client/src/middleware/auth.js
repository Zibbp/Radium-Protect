export default function auth({ next, router, store }) {
  console.log("yooo");
  if (!store.state.loggedIn) {
    return router.push({ name: "login" });
  }

  return next();
}
