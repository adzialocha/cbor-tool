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
});

const load = () => {
  const cddl = window.localStorage.getItem("cddl");
  if (cddl) {
    elements["input-cddl"].value = cddl;
  }
};

const elements = [
  "input-cddl",
  "input-hex",
  "output-json",
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
        throw Error(`${result.status} "${result.statusText}"`);
      }
      return result.json();
    })
    .catch((error) => {
      window.alert(`Something went wrong! ${error}`);
      return Promise.reject(error);
    });
};

const convert = async (hex) => {
  elements["output-json"].value = "";

  return request(["api", "convert"], { hex })
    .then(({ result }) => {
      elements["output-json"].value = JSON.stringify(result, null, 2);
    })
    .catch(() => {
      // Do nothing
    });
};

const validate = async (hex, cddl) => {
  elements["output-validation"].value = "";

  return request(["api", "validate"], { hex, cddl })
    .then(({ result }) => {
      elements["output-validation"].value = result;
    })
    .catch(() => {
      // Do nothing
    });
};

elements["run-convert"].addEventListener("click", async () => {
  const hex = elements["input-hex"].value;

  if (!hex) {
    window.alert("CBOR (HEX) input is empty.");
    return;
  }

  await convert(hex);
});

elements["run-validate"].addEventListener("click", async () => {
  const hex = elements["input-hex"].value;
  const cddl = elements["input-cddl"].value;

  if (!hex || !cddl) {
    window.alert("CBOR (HEX) or CDDL input is empty.");
    return;
  }

  await validate(hex, cddl);
});

elements["input-cddl"].addEventListener("input", store);

load();
