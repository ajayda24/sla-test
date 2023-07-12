import FlagIN from "../assets/flags/india.png";
import FlagKSA from "../assets/flags/saudiarabia.png";
import FlagBD from "../assets/flags/bangladesh.png";
const flags = {
  IN: FlagIN,
  BD: FlagBD,
  KSA: FlagKSA,
};

export const getFormattedDate = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (!date) return "-";
  var dateObj = new Date(date);
  var month = months[dateObj.getMonth()];
  var day = dateObj.getDate();
  var year = dateObj.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const getFlag = (country_code = "IN") => {
  const flag = flags[country_code];
  return flag;
};

export const printValidationError = (err, component) => {
  if (err?.response?.status === 401) {
    const validationError = err.response?.data?.validation_error;
    console.log(validationError);
    if (validationError) {
      for (let col in validationError) {
        const element = document.getElementById(`${component}-${col}`);
        console.log(component, col);
        if (element) {
          element.style.display = "flex";
          element.innerText = validationError[col].toString();
        }
      }
    }
  }
};

export const sliceWords = (sentence, count) => {
  const updated = sentence?.split(" ").slice(0, 20).join(" ");
  const dot = sentence.split(" ").length > 20 ? "..." : "";
  return updated + dot;
};
