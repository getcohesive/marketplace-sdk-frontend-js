import { DEBUG, ERROR, log } from "./common";

const pendingResponseCollection = [];

//* parent message handler
function responseFromMobileClient(e) {
  const response = e.data;
  log(DEBUG, {
    message: "responseFromMobileClient: event received.",
    extra: response,
  });
  if (response.source === "cohesive") {
    //find the request we should respond to
    const responseItem = pendingResponseCollection.find(
      (element) => element.guid === response.guid
    );
    //respond
    if (responseItem) responseItem.resolver(response.data);

    //remove the pending call
    if (responseItem) {
      const index = pendingResponseCollection.indexOf(responseItem);
      if (index > -1) pendingResponseCollection.splice(index, 1);
    }
  }
}

//* page sync internal---------------------------------------------------------------
const pageSyncSetup = () => {
  let previousUrl = "";
  const observer = new MutationObserver(function (mutations) {
    if (location.href !== previousUrl) {
      const message = JSON.stringify({
        source: "cohesive",
        event: "path-updated",
        data: {
          oldUrl: previousUrl,
          newUrl: location.href,
          newPath: location.pathname,
        },
      });
      previousUrl = location.href;
      //* make sure to add cross site restriction for communication
      window.parent.postMessage(message, "*");
    }
  });
  return observer;
};

const onLoadCallback = () => {
  window.addEventListener("message", responseFromMobileClient);
  const observer = pageSyncSetup();
  const config = { subtree: true, childList: true };
  observer.observe(document, config);
};

const destroy = () => {
  window.removeEventListener("message", responseFromMobileClient);
};

export const setupPageSync = () => {
  if (typeof window !== "undefined") {
    window.addEventListener("load", onLoadCallback);
    window.addEventListener("unload", destroy);
    log(DEBUG, "setupPageSync completed");
  } else {
    log(ERROR, "setupPageSync Failed");
  }
};

function uuidv4() {
  return Date.now() + Math.random();
}

//client to wire web calling function
export function makeAjaxCall<T>(command: "USER_DATA") {
  const guid = uuidv4().toString();

  let resolver;
  const promise = new Promise<T>((resolve, reject) => {
    resolver = (message) => {
      if (message) {
        message.error ? reject(message) : resolve(message);
      } else {
        reject({ error: "Something went wrong" });
      }
    };
  });

  //add the unresolved promise to array of promises
  pendingResponseCollection.push({ guid, resolver });

  //send message to Parent
  window.parent.postMessage({ command, guid, source: "cohesive" }, "*");

  return promise;
}
