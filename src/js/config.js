/*
 ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗ 
██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝ 
██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗
██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║
╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝ */

export const API_URL = `https://forkify-api.jonas.io/api/v2/recipes/`;
export const API_KEY = `38f80afb-ef38-40af-920a-8d5eddc3ff47`;
export const TIMEOUT_SECONDS = 10;

(async function (params) {
  const response = await fetch(
    "https://forkify-api.jonas.io/api/v2/recipes?search=pizza&key=5db3d67c-5ae0-471d-a012-6f5b2c90fa12"
  );
  const data = await response.json();
  console.log(data);
})();
