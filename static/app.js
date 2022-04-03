const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};

const store = debounce(() => {
  const cddl = elements["input-cddl"].value;
  window.localStorage.setItem("cddl", cddl);
})();

const load = () => {
  const cddl = window.localStorage.getItem("cddl");
  if (cddl) {
    elements["input-cddl"].value = cddl;
  }
};

const elements = [
  "input-cddl",
  "value-hex",
  "value-json",
  "output-validation",
  "run-convert",
  "run-validate",
].reduce((acc, id) => {
  acc[id] = document.getElementById(id);
  return acc;
}, {});

const request = async (path, data) => {
  return window
    .fetch(path.join("/"), {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((result) => {
      if (result.status !== 200) {
        throw Error(result.statusText);
      }
      return result.json();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const toJSON = async (hex) => {
  elements["value-json"].value = "";

  return request(["api", "toJSON"], { hex })
    .then(({ result }) => {
      elements["value-json"].value = JSON.stringify(result, null, 2);
    })
    .catch((error) => {
      elements["value-json"].value = `Something went wrong! ${error}`;
    });
};

const toCBOR = async (json) => {
  elements["value-hex"].value = "";

  return request(["api", "toCBOR"], { json })
    .then(({ result }) => {
      elements["value-hex"].value = result;
    })
    .catch((error) => {
      elements["value-hex"].value = `Something went wrong!\n\n${error.message}`;
    });
};

const validate = async (hex, cddl) => {
  elements["output-validation"].value = "";

  return request(["api", "validate"], { hex, cddl })
    .then(({ result }) => {
      elements["output-validation"].value = result;
    })
    .catch((error) => {
      elements["output-validation"].value = `Something went wrong! ${error}`;
    });
};

elements["value-hex"].addEventListener("keyup", async () => {
  const hex = elements["value-hex"].value;

  if (!hex) {
    elements["value-json"].value = ""
    return;
  }
  elements["value-json"].value = "tasting cbor..."
  debounce(toJSON)(hex);
})

elements["value-json"].addEventListener("keyup", async () => {
  const json = elements["value-json"].value;

  if (!json) {
    elements["value-hex"].value = ""
    return;
  }
  elements["value-hex"].value = "tasting json..."
  debounce(toCBOR)(json);
})

elements["input-cddl"].addEventListener("keyup", async () => {
  const hex = elements["value-hex"].value;
  const cddl = elements["input-cddl"].value;

  if (!hex || !cddl) {
    elements["output-validation"].value = "CBOR (HEX) or CDDL input is empty.";
    return;
  }

  elements["output-validation"].value = "validating..."
  debounce(validate)(hex, cddl);
})

elements["input-cddl"].addEventListener("input", store);

load();
