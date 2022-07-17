// 서울의 위도와 경도
const lat = 37.57;
const lon = 126.98;
// openweathermap API KEY
const apiKey = "8fec1bd69ec6dca203b5e9faff61cb70";

// axios
//   .get(
//     `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
//   )
//   .then((res) => console.log(res));

const setRenderBackground = async () => {
  const response = await axios.get("https://picsum.photos/1280/720", {
    // 이미지는 Binary 데이터 -> 영상, 음악, 이미지
    responseType: "blob", // 이미지, 음성 등의 바이너리 데이터, axios 지원 함수
  });
  // 해당 이미지가 가지는 url 을 가져옴
  const imageURL = URL.createObjectURL(response.data);
  document.querySelector("body").style.backgroundImage = `url(${imageURL})`;
};

// 1초 간격으로 시간 바꿈
const setTime = () => {
  const timer = document.querySelector(".timer");
  const timer_content = document.querySelector(".timer-content");
  setInterval(() => {
    // Date() : 현재 날짜와 시간 가져오기
    const date = new Date();
    // (심화) 오전 오후 구분하기!!
    if(date.getHours() >= 12) timer_content.textContent = `Good evening!`;
    else timer_content.textContent =`Good morning!`;
    // 시간, 분, 초 00 으로 만들어주기
    timer.textContent = `${("00"+date.getHours()).slice(-2)}:${("00"+date.getMinutes()).slice(-2)}:${("00"+date.getSeconds()).slice(-2)}`;
  }, 1000);
};



// 스토리지에 저장된 데이터를 메모에 붙이기
const getMemo = () => {
  const memo = document.querySelector(".memo");
  // 스트로지에 저장된 키 값의 value 가져오기
  const memoValue = localStorage.getItem("todo");
  // console.log(memoValue);
  memo.textContent = memoValue;
};

const setMemo = () => {
  const memoInput = document.querySelector(".memo-input");
  memoInput.addEventListener("keyup", (evt) => {
    // Enter 입력과 값이 있다면
    //   console.log(evt.currentTarget.value);
    if (evt.code === "Enter" && evt.currentTarget.value) {
      // localStorage 브라우저 상에 데이터를 저장할 수 있는 웹 스토리지의 일종
      // localstorage에 "key"값과 value를 저장하는 함수
      localStorage.setItem("todo", evt.currentTarget.value);
      // 메모 붙이기 함수 호출
      getMemo();
      // 입력창 지우기
      memoInput.value = "";
    }
  });
};

const deleteMemo = () => {
  document.addEventListener("click", (evt) => {
    // 이벤트 버블링 응용 , querySelector로 쉽게 구현 가능
    if (evt.target.classList.contains("memo")) {
      localStorage.removeItem("todo");
      evt.target.textContent = "";
    }
  });
};

const setModalDate = () => {
  const modalDate = document.querySelector(".modal_date");
  const date = new Date();

  // 001 혹은 0010 이렇게 만들어주고 뒤에 2개만 뽑아내기
  modalDate.textContent = `${date.getFullYear()}-${("00"+(date.getMonth() + 1)).slice(-2)}-${("00"+date.getDate()).slice(-2)}`;
};

const matchIcon = (weatherDate) => {
  if (weatherDate === "Clear") {
    return "./images/039-sun.png";
  }
  if (weatherDate === "Clouds") {
    return "./images/001-cloud.png";
  }
  if (weatherDate === "Rain") {
    return "./images/003-rainy.png";
  }
  if (weatherDate === "Snow") {
    return "./images/006-snowy.png";
  }
  if (weatherDate === "Thunderstorm") {
    return "./images/008-storm.png";
  }
  if (weatherDate === "Drizzle") {
    return "./images/033-hurricane.png";
  }
};

const getWeather = async (lat, lon, apiKey) => {
  const data = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
  );
  console.log(data);
  return data;
};

const weatherWrapperComponent = (li) => {
    //  현재 절대온도인데, 섭씨로 바꿔준다.
    // 소수 1자리까지
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1);
    return `
      <div class="card">
        <div class="card-header">${li.dt_txt.split(" ")[0]}</div>
        <div class="card-body">
          <h5 class="card-title">${li.weather[0].main}</h5>
          <img
            src="${matchIcon(li.weather[0].main)}"
            width="60px"
            height="60px"
            class="card-img-top"
            alt="날씨"
          />
          <p class="card-text">${changeToCelsius(li.main.temp)}˚</p>
        </div>
      </div>`;
  };
  
  const renderWeather = async (lat, lon, apiKey) => {
    const weatherResponse = await getWeather(lat, lon, apiKey);
    const weatherData = weatherResponse.data;
    console.log(weatherData);
    const weatherList = weatherData.list.reduce((total, cur) => {
      if (cur.dt_txt.indexOf("18:00:00") > 0) {
        total.push(cur);
      }
      return total;
    }, []);
    const cardGroup = document.querySelector(".card-group");
    console.log(weatherList);
    // (심화) 좌측 상단 이미지를 현재 날씨로 이미지로 변경
    document.querySelector(".modal_button").style.backgroundImage = `url(${matchIcon(weatherList[0].weather[0].main)})`;
    // weatherList가 어떻게 넘어오는지 파악하고 실행된 함수들 이해하기
    cardGroup.innerHTML = weatherList
      .map((li) => weatherWrapperComponent(li))
      .join(""); // 중간에 아무 문자(,) 없이 계속 이어붙인다.
  };
setRenderBackground();
setInterval(() => {
  setRenderBackground();
}, 5000);
// 시간 설정
setTime();
setMemo();
deleteMemo();
setModalDate();
renderWeather(lat, lon, apiKey);