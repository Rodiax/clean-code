// noinspection JSUnusedGlobalSymbols

const Decimal = require("decimal.js");
const ValidationResult = require("./validation-result");

const MAX_DIGITS_COUNT = 11;
/**
 * Matcher validates that string value represents a decimal number or null.
 * Decimal separator is always "."
 * In addition, it must comply to the rules described below.
 *
 * @param params - Matcher can take 0 to 2 parameters with following rules:
 * - no parameters: validates that number of digits does not exceed the maximum value of 11.
 * - one parameter: the parameter specifies maximum length of number for the above rule (parameter replaces the default value of 11)
 * - two parameters:
 *   -- first parameter represents the total maximum number of digits,
 *   -- the second parameter represents the maximum number of decimal places.
 *   -- both conditions must be met in this case.
 */
class DecimalNumberMatcher {
  constructor(maxDigits, maxDecPlaces) {
    this.maxDigits = maxDigits;
    this.maxDecPlaces = maxDecPlaces;
    this.hasInputs = arguments.length > 0;
  }

  match(value) {
    return this.#getValidationResult(value);
  }

  #getValidationResult(value) {
    const result = new ValidationResult();
    const decimal = this.#getDecimal(value);

    if (!decimal) {
      result.addInvalidTypeError("doubleNumber.e001", "The value is not a valid decimal number.");
    }

    if (this.#isPrecisionGreater(decimal, this.hasInputs ? this.maxDigits : MAX_DIGITS_COUNT)) {
      result.addInvalidTypeError("doubleNumber.e002", "The value exceeded maximum number of digits.");
    }

    if (this.#isDecPlacesGreater(decimal, this.maxDecPlaces)) {
      result.addInvalidTypeError("doubleNumber.e003", "The value exceeded maximum number of decimal places.");
    }

    return result;
  }

  #getDecimal(value) {
    let decimal;

    try {
      decimal = new Decimal(value);
    } catch (e) {
      decimal = null;
    }

    return decimal;
  }

  #isPrecisionGreater(decimal, value) {
    return decimal?.precision(true) > value;
  }

  #isDecPlacesGreater(decimal, value) {
    return decimal?.decimalPlaces() > value;
  }
}

module.exports = DecimalNumberMatcher;