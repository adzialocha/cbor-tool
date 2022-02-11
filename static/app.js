function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

const store = debounce(() => {
  const cddl = document.getElementById('input-cddl').value;
  window.localStorage.setItem('cddl', cddl);
});

const load = () => {
  const cddl = window.localStorage.getItem('cddl');
  if (cddl) {
    document.getElementById('input-cddl').value = cddl;
  }
};

const request = (path, data) => {
  return window.fetch(path.join('/'), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((result) => {
    if (result.status !== 200) {
      throw Error(`${result.status} "${result.statusText}"`);
    }
    return result.json();
  }).catch((error) => {
    window.alert(`Something went wrong! ${error}`);
    return Promise.reject(error);
  });
};

const convert = (hex) => {
  document.getElementById('output-json').value = '';
  request(['api', 'convert'], { hex }).then(({ result }) => {
    document.getElementById('output-json').value = JSON.stringify(result, null, 2);
  }).catch(() => {
    // Do nothing
  })
};

const validate = (hex, cddl) => {
  document.getElementById('output-validation').value = '';
  request(['api', 'validate'], { hex, cddl }).then(({ result }) => {
    document.getElementById('output-validation').value = result;
  }).catch(() => {
    // Do nothing
  })
};

document.getElementById('run-convert').addEventListener('click', (event) => {
  const hex = document.getElementById('input-hex').value;

  if (!hex) {
    window.alert('CBOR (HEX) input is empty.')
    return;
  }

  convert(hex);
});

document.getElementById('run-validate').addEventListener('click', (event) => {
  const hex = document.getElementById('input-hex').value;
  const cddl = document.getElementById('input-cddl').value;

  if (!hex || !cddl) {
    window.alert('CBOR (HEX) or CDDL input is empty.')
    return;
  }

  validate(hex, cddl);
});

document.getElementById('input-cddl').addEventListener('input', store);

load();
