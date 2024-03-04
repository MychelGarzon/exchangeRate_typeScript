interface Data {
  conversion_rates: Record<string, number>;
}
interface ImportMeta {
  env: {
    VITE_API_KEY: string;
  };
}

class FetchWrapper {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  get(endpoint: string): Promise<Data> {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint: string, body: any): Promise<any> {
    return this._send('put', endpoint, body);
  }

  post(endpoint: string, body: any): Promise<any> {
    return this._send('post', endpoint, body);
  }

  delete(endpoint: string, body: any): Promise<any> {
    return this._send('delete', endpoint, body);
  }

  _send(method: string, endpoint: string, body: any): Promise<any> {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

// A global variable that references the HTML select element with the id base-currency
const baseCurrencyElement = document.querySelector(
  '#base-currency'
) as HTMLSelectElement;

// A global variable that references the HTML select element with the id target-currency
const targetCurrencyElement = document.querySelector(
  '#target-currency'
) as HTMLSelectElement;

// A global variable that references the HTML paragraph element with the id conversion-result
const resultElement = document.querySelector(
  '#conversion-result'
) as HTMLParagraphElement;

// A global variable that stores the conversion rates for each currency pair as an array of arrays
let conversionArray: [string, number][] = [];
// An instance of the FetchWrapper class with the base URL of the API
const apiKey: string = import.meta.env.VITE_API_KEY;
const baseUrlApi = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/`;
// A constant that stores the API key for authentication

// Add an event listener to the base element that invokes the g.etConversionRates function when the user selects a new value
const fetchWrapper = new FetchWrapper(baseUrlApi);

// A call to the get method of the API instance with the endpoint that requests the latest conversion rates for the USD currency
// Assign the conversion_rates property of the response data to the rates variable

// Add an event listener to the base element that invokes the getConversionRates function when the user selects a new value
const getConversionRates = async () => {
  const base = baseCurrencyElement.value;
  const target = targetCurrencyElement.value;

  // Clean previous data from conversionArray
  conversionArray = [];

  try {
    // Fetch conversion rates and populate conversionArray
    const res = await fetchWrapper.get(base);

    if (res && res.conversion_rates) {
      const data = res.conversion_rates;

      for (const currency in data) {
        const currencyArr: [string, number] = [currency, data[currency]];
        conversionArray.push(currencyArr);
      }
    }

    currencyConversionRate(conversionArray, target);
  } catch (error) {
    alert('Error fetching conversion rates:');
  }
};

baseCurrencyElement.addEventListener('change', getConversionRates);

// Add an event listener to the target element that invokes the getConversionRates function when the user selects a new value
targetCurrencyElement.addEventListener('change', getConversionRates);

// A function that performs the currency conversion and updates the UI
// Iterate over the rates array and find the rate that matches the target currency value
// If the currency name matches the target currency value
// Assign the conversion rate to the textContent property of the result element, which displays it on the web page
const currencyConversionRate = (
  currencyArr: [string, number][],
  target: string
) => {
  const conversionInfo = currencyArr.find(([currency]) => currency === target);

  if (conversionInfo) {
    const [currencyName, conversionRate] = conversionInfo;
    resultElement.textContent = `1 ${baseCurrencyElement.value} = ${conversionRate} ${currencyName}`;
  } else {
    resultElement.textContent = 'Conversion rate not found';
  }
};
