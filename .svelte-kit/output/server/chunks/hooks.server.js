import "./index2.js";
const protectedRoutes = ["/dashboard"];
async function handle({ event, resolve }) {
  if (protectedRoutes.some((route) => event.url.pathname.startsWith(route))) ;
  const response = await resolve(event);
  return response;
}
export {
  handle
};
