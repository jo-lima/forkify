/*╦╔╦╗╔═╗╔═╗╦═╗╔╦╗╔═╗
  ║║║║╠═╝║ ║╠╦╝ ║ ╚═╗
  ╩╩ ╩╩  ╚═╝╩╚═ ╩ ╚═╝*/
import { TIMEOUT_SECONDS } from "./config";

/*██╗  ██╗███████╗██╗     ██████╗ ███████╗██████╗ ███████╗
  ██║  ██║██╔════╝██║     ██╔══██╗██╔════╝██╔══██╗██╔════╝
  ███████║█████╗  ██║     ██████╔╝█████╗  ██████╔╝███████╗
  ██╔══██║██╔══╝  ██║     ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║
  ██║  ██║███████╗███████╗██║     ███████╗██║  ██║███████║
  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝*/

function timeout(seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} second`)
      );
    }, seconds * 1000);
  });
}

export async function getJSON(url) {
  try {
    // |FETCH DATA|
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]); // FETCH URL OR TIMEOUT
    const data = await response.json();

    // |IN CASE REQUEST IS INVALID|
    if (!response.ok) {
      throw new Error(`${data.message} (${response.status})`);
    }

    return data;
  } catch (error) {
    throw error; // RE-THROWING ERROR TO BE HANDLED LATER
  }
}
