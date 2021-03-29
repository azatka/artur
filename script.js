$(document).ready(function () {
  console.log("version 3.1");
  setInterval(() => {
    $("#time").text(time());
  }, 100);

  let time = () => {
    let t = new Date();
    let day = t.getDate();
    let month = parseInt(t.getMonth()) + 1;
    month = month < 10 ? "0" + month : month;
    let year = t.getFullYear();
    let hh = t.getHours() < 10 ? "0" + t.getHours() : t.getHours();
    let mm = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes();
    let ss = t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds();
    return day + "/" + month + "/" + year + " " + hh + ":" + mm + ":" + ss;
  };

  var move_detect = [false, false];
  var window_detect = [false, false];
  var door_detect = [false, false];
  var log_text = "";
  var status = false;
  // Проверяем чекбоксы
  let getDetectInfo = () => {
    move_detect[0] = $("#move_detect_1").is(":checked") ? true : false;
    move_detect[1] = $("#move_detect_2").is(":checked") ? true : false;
    window_detect[0] = $("#window_detect_1").is(":checked") ? true : false;
    window_detect[1] = $("#window_detect_2").is(":checked") ? true : false;
    door_detect[0] = $("#door_detect_1").is(":checked") ? true : false;
    door_detect[1] = $("#door_detect_2").is(":checked") ? true : false;
  };

  let log = (text) => {
    log_text += text + "\n";
    $("#log").val(log_text);
  };

  let attention = (text) => {
    al(text);
    setTimeout(() => {
      $("#alert").hide();
    }, 5000);
  };

  var err = [false, false];
  var err1 = [false, false];
  var point = [6, 6];
  var recovery = [false, false];
  var interval, interval2;
  var sims = [0, 0, 0, 0];
  var crash = [false, false, false, false];
  var timeOfRecovery = [0, 0];

  let timer1 = (sec) => {
    setTimeout(() => {
      err[0] = false;
      recovery[0] = true;
      timeOfRecovery[0] = setInterval(() => {
        if (point[0] == 6) {
          recovery[0] = false;
          log(time() + " - В комнате 1 движение прекращено!");
          clearInterval(timeOfRecovery[0]);
        } else {
          point[0]++;
          myChart1.data.datasets[0].data.push({ x: new Date(), y: point[0] });
          myChart1.update();
        }
      }, 1234);
    }, sec);
  };

  let timer2 = (sec) => {
    setTimeout(() => {
      recovery[1] = true;
      err[1] = false;
      timeOfRecovery[1] = setInterval(() => {
        if (point[1] == 6) {
          recovery[1] = false;
          log(time() + " - В комнате 2 движение прекращено!");
          clearInterval(timeOfRecovery[1]);
        } else {
          point[1]++;
          myChart2.data.datasets[0].data.push({ x: new Date(), y: point[1] });
          myChart2.update();
        }
      }, 1234);
    }, sec);
  };

  let chart1 = () => {
    sims[0] = setInterval(() => {
      if (!err[0] && !recovery[0]) {
        //В датчик ничего не попадает
        myChart1.data.datasets[0].data.push({ x: new Date(), y: 6 });
        myChart1.update();
      } else if (err[0]) {
        let n_step = Math.floor(
          Math.random() * (point[0] + 2 - (point[0] - 1)) + (point[0] - 1)
        );
        point[0] = n_step < 0 ? 0 : n_step;
        point[0] = n_step > 5 && err[0] ? 5 : point[0];
        if (err[0]) {
          myChart1.data.datasets[0].data.push({ x: new Date(), y: point[0] });
          myChart1.update();
        }
      }
    }, 1000);
  };

  let chart2 = () => {
    sims[1] = setInterval(() => {
      if (!err[1] && !recovery[1]) {
        //В датчик ничего не попадает
        myChart2.data.datasets[0].data.push({ x: new Date(), y: 6 });
        myChart2.update();
      } else if (err[1]) {
        let n_step = Math.floor(
          Math.random() * (point[1] + 2 - (point[1] - 1)) + (point[1] - 1)
        );
        point[1] = n_step == 0 ? point[1] : n_step;
        point[1] = n_step > 5 && err[1] ? 5 : point[1];
        if (err[1]) {
          myChart2.data.datasets[0].data.push({ x: new Date(), y: point[1] });
          myChart2.update();
        }
      }
    }, 1000);
  };

  var s_gc = [0.1, 0.1];
  var m_gc = [0, 0];
  var m_gc_c = [10, 10];

  let chart3 = () => {
    sims[2] = setInterval(() => {
      if (!err1[0]) {
        //В датчик ничего не попадает
        myChart3.data.datasets[0].data.push({
          x: new Date(),
          y: s_gc[0],
        });
        myChart3.update();
      } else if (err1[0]) {
        if (err1[0]) {
          myChart3.data.datasets[0].data.push({ x: new Date(), y: s_gc[0] });
          myChart3.update();
        }
        if (s_gc[0] < m_gc[0] && m_gc_c[0] > 2) {
          s_gc[0] = Math.random() * (s_gc[0] + 2 - s_gc[0]) + s_gc[0];
          m_gc[0] = m_gc[0] - 1;
        } else {
          s_gc[0] = s_gc[0] - 1;
          s_gc[0] =
            Math.random() * (s_gc[0] + 0.5 - (s_gc[0] - 0.2)) + (s_gc[0] - 0.2);
        }
        if (s_gc[0] < 0) {
          err1[0] = false;
          s_gc[0] = 0.1;
          if (!err[0] && !recovery[0] && move_detect[0]) {
            log(time() + " - В комнате 1 обнаружено движение!");
            callMoveErr(0);
          }
        }
      }
    }, 100);
  };

  let chart4 = () => {
    sims[3] = setInterval(() => {
      if (!err1[1]) {
        //В датчик ничего не попадает
        myChart4.data.datasets[0].data.push({
          x: new Date(),
          y: s_gc[1],
        });
        myChart4.update();
      } else if (err1[1]) {
        if (err1[1]) {
          myChart4.data.datasets[0].data.push({ x: new Date(), y: s_gc[1] });
          myChart4.update();
        }
        if (s_gc[1] < m_gc[1] && m_gc_c[1] > 2) {
          s_gc[1] = Math.random() * (s_gc[1] + 2 - s_gc[1]) + s_gc[1];
          m_gc[1] = m_gc[1] - 1;
        } else {
          s_gc[1] = s_gc[1] - 1;
          s_gc[1] =
            Math.random() * (s_gc[1] + 0.5 - (s_gc[1] - 0.2)) + (s_gc[1] - 0.2);
        }
        if (s_gc[1] < 0) {
          err1[1] = false;
          s_gc[1] = 0.1;
          if (!err[1] && !recovery[1] && move_detect[1]) {
            log(time() + " - В комнате 2 обнаружено движение!");
            callMoveErr(1);
          }
        }
      }
    }, 100);
  };

  let clear = () => {
    if (!err[0]) {
      myChart1.data.datasets[0].data = [];
      myChart1.update();
    }
    if (!err[1]) {
      myChart2.data.datasets[0].data = [];
      myChart2.update();
    }
    if (!err1[0]) {
      myChart3.data.datasets[0].data = [];
      myChart3.update();
    }
    if (!err1[1]) {
      myChart4.data.datasets[0].data = [];
      myChart4.update();
    }
  };

  let callMoveErr = (room) => {
    err[room] = true;
    room == 0
      ? timer1(Math.floor(Math.random() * (30 - 10) + 10) * 1000)
      : timer2(Math.floor(Math.random() * (30 - 10) + 10) * 1000);
  };

  let callWindowErr = (room) => {
    s_gc[room] = Math.random() * (21 - 10) + 10;
    m_gc[room] = (s_gc[room] * 40) / 100;
    m_gc_c[room] = 10;
    err1[room] = true;
  };

  $("#start").click(() => {
    if (!status) {
      status = true;
      clear();
      $("#start").prop("disabled", true);
      $("#stop").prop("disabled", false);
      log(time() + " - Система запущена!");
      repair();
      getDetectInfo();
      if (move_detect[0]) chart1();
      if (move_detect[1]) chart2();
      if (window_detect[0]) chart3();
      if (window_detect[1]) chart4();

      interval2 = setInterval(() => {
        addRow(1);
        addRow(2);
      }, 1000);

      interval = setInterval(() => {
        cycle();
      }, 3000);
    }
  });
  let al = (text) => {
    $("#alert").text(text);
    $("#alert").show();
  };
  var power = 0;
  let cycle = () => {
    getDetectInfo();
    let rnd = Math.floor(Math.random() * (30 - 0) + 0);
    let rnd2 = Math.floor(Math.random() * (20 - 0) + 0);
    if (rnd == 15 && !err[0] && !recovery[0] && move_detect[0]) {
      log(time() + " - В комнате 1 обнаружено движение!");
      callMoveErr(0);
    } else if (rnd == 17 && !err[1] && !recovery[1] && move_detect[1]) {
      log(time() + " - В комнате 2 обнаружено движение!");
      callMoveErr(1);
    } else if (rnd == 19 && !err1[0] && window_detect[0]) {
      log(time() + " - В комнате 1 разбили стекло!");
      callWindowErr(0);
    } else if (rnd == 21 && !err1[1] && window_detect[1]) {
      log(time() + " - В комнате 2 разбили стекло!");
      callWindowErr(1);
    } else if (rnd == 5 && door_detect[0]) {
      log(time() + " - В комнате 1 открыли дверь!");
    } else if (rnd == 7 && door_detect[1]) {
      log(time() + " - В комнате 2 открыли дверь!");
    }
    // Аварии
    if (rnd2 == 5) {
      let temp = Math.floor(Math.random() * (15 - 5) + 5);
      log(time() + " - Основное питание отключено!");
      power = setInterval(() => {
        if (temp == 0) {
          $("#alert").hide();
          log(time() + " - Основное питание восстановлено!");
          clearInterval(power);
        } else {
          al(
            "ЭП отключено, запущено резервное питание! До восстановления основного питания осталось: " +
              temp +
              " секунд."
          );
          temp = temp - 1;
        }
      }, 1000);
    } else if (rnd2 == 10) {
      // ПОЛОМКА ДАТЧИКОВ!
      let c_crash = 0;
      crash.forEach((el) => {
        if (el) c_crash++;
      });
      if (c_crash == 6) {
        al(
          "Все датчики поломаны, для возобновления работы необходимо их исправить!"
        );
      }
      let rnd3 = Math.floor(Math.random() * (6 - 0) + 0);
      if (rnd3 == 2 && !err[0] && !recovery[0] && move_detect[0]) {
        log(time() + " - В комнате 1 связь с датчиком движения потеряна!");
        attention(time() + " - В комнате 1 связь с датчиком движения потеряна!")
        point[0] = "N/A";
        clearInterval(sims[0]);
        crash[0] = true;
        $("#move_detect_1").prop("checked", false);
        $("#move_detect_1").prop("disabled", true);
        if ($("#repair").prop("disabled")) $("#repair").prop("disabled", false);
      } else if (rnd3 == 3 && !err[1] && !recovery[1] && move_detect[1]) {
        log(time() + " - В комнате 2 связь с датчиком движения потеряна!");
        attention(time() + " - В комнате 2 связь с датчиком движения потеряна!")
        point[1] = "N/A";
        clearInterval(sims[1]);
        crash[2] = true;
        $("#move_detect_2").prop("checked", false);
        $("#move_detect_2").prop("disabled", true);
        if ($("#repair").prop("disabled")) $("#repair").prop("disabled", false);
      } else if (rnd3 == 0 && !err1[0] && window_detect[0]) {
        log(
          time() + " - В комнате 1 связь с датчиком разбития стекла потеряна!"
        );
        attention(time() + " - В комнате 1 связь с датчиком разбития стекла потеряна!")
        s_gc[0] = "N/A";
        clearInterval(sims[2]);
        crash[1] = true;
        $("#window_detect_1").prop("checked", false);
        $("#window_detect_1").prop("disabled", true);
        if ($("#repair").prop("disabled")) $("#repair").prop("disabled", false);
      } else if (rnd3 == 1 && !err1[1] && window_detect[1]) {
        log(
          time() + " - В комнате 2 связь с датчиком разбития стекла потеряна!"
        );
        attention(time() + " - В комнате 2 связь с датчиком разбития стекла потеряна!")
        s_gc[1] = "N/A";
        clearInterval(sims[3]);
        crash[3] = true;
        $("#window_detect_2").prop("checked", false);
        $("#window_detect_2").prop("disabled", true);
        if ($("#repair").prop("disabled")) $("#repair").prop("disabled", false);
      } else if (rnd3 == 4 && door_detect[0]) {
        crash[4] = true;
        log(time() + " - В комнате 1 связь с датчиком открытия потеряна!");
        attention(time() + " - В комнате 1 связь с датчиком открытия потеряна!")
        $("#door_detect_1").prop("checked", false);
        $("#door_detect_1").prop("disabled", true);
        if ($("#repair").prop("disabled")) $("#repair").prop("disabled", false);
      } else if (rnd3 == 5 && door_detect[1]) {
        crash[5] = true;
        log(time() + " - В комнате 2 связь с датчиком открытия потеряна!");
        attention(time() + " - В комнате 2 связь с датчиком открытия потеряна!")
        $("#door_detect_2").prop("checked", false);
        $("#door_detect_2").prop("disabled", true);
        if ($("#repair").prop("disabled")) $("#repair").prop("disabled", false);
      }
    }
  };
  $("#stop").click(() => {
    if (status) {
      status = false;
      $("#start").prop("disabled", false);
      $("#stop").prop("disabled", true);
      log(time() + " - Система остановлена!");
      clearInterval(interval);
      clearInterval(interval2);
      sims.forEach((el) => {
        clearInterval(el);
      });
      timeOfRecovery.forEach((el) => {
        clearInterval(el);
      });
      recovery = [false, false];
      err = [false, false];
      err1 = [false, false];
      point = [6, 6];
      s_gc = [0.1, 0.1];
    }
  });

  let repair = () => {
    if (crash[0]) {
      chart1();
      point[0] = 6;
      crash[0] = false;
      $("#move_detect_1").prop("checked", true);
      $("#move_detect_1").prop("disabled", false);
      log(time() + " - В комнате 1 исправили датчик движения.");
    }
    if (crash[1]) {
      chart3();
      s_gc[0] = 0.1;
      crash[1] = false;
      $("#window_detect_1").prop("checked", true);
      $("#window_detect_1").prop("disabled", false);
      log(time() + " - В комнате 1 исправили датчик разбития окна.");
    }
    if (crash[2]) {
      chart2();
      point[1] = 6;
      crash[2] = false;
      $("#move_detect_2").prop("checked", true);
      $("#move_detect_2").prop("disabled", false);
      log(time() + " - В комнате 2 исправили датчик движения.");
    }
    if (crash[3]) {
      chart4();
      s_gc[1] = 0.1;
      crash[3] = false;
      $("#window_detect_2").prop("checked", true);
      $("#window_detect_2").prop("disabled", false);
      log(time() + " - В комнате 2 исправили датчик разбития окна.");
    }
    if (crash[4]) {
      crash[4] = false;
      $("#door_detect_1").prop("checked", true);
      $("#door_detect_1").prop("disabled", false);
      log(time() + " - В комнате 1 исправили датчик открытия двери.");
    }
    if (crash[5]) {
      crash[5] = false;
      $("#door_detect_2").prop("checked", true);
      $("#door_detect_2").prop("disabled", false);
      log(time() + " - В комнате 2 исправили датчик открытия двери.");
    }
    if (!$("#repair").prop("disabled")) $("#repair").prop("disabled", true);
  };

  $("#repair").click(() => {
    repair();
  });

  $("#clear").click(() => {
    clear();
  });

  let addRow = (room) => {
    $("#room_" + room + " tbody").prepend(
      $(
        "<tr><td>" +
          time() +
          "</td>" +
          "<td>" +
          point[room - 1] +
          "</td><td>" +
          s_gc[room - 1] +
          "</td></tr>"
      )
    );
  };

  $("#move_detect_1").change(() => {
    if ($("#move_detect_1").is(":checked")) {
      log(time() + " - Датчик движения в 1 комнате включен");
      chart1();
      point[0] = 6;
    } else {
      log(time() + " - Датчик движения в 1 комнате отключен");
      point[0] = "N/A";
      clearInterval(sims[0]);
    }
  });

  $("#move_detect_2").change(() => {
    if ($("#move_detect_2").is(":checked")) {
      log(time() + " - Датчик движения в 2 комнате включен");
      chart2();
      point[1] = 6;
    } else {
      log(time() + " - Датчик движения в 2 комнате отключен");
      point[1] = "N/A";
      clearInterval(sims[1]);
    }
  });

  $("#window_detect_1").change(() => {
    if ($("#window_detect_1").is(":checked")) {
      log(time() + " - Датчик разбития окон в 1 комнате включен");
      chart3();
      s_gc[0] = 0.1;
    } else {
      log(time() + " - Датчик разбития окон в 1 комнате отключен");
      s_gc[0] = "N/A";
      clearInterval(sims[2]);
    }
  });

  $("#window_detect_2").change(() => {
    if ($("#window_detect_2").is(":checked")) {
      log(time() + " - Датчик разбития окон в 2 комнате включен");
      chart4();
      s_gc[1] = 0.1;
    } else {
      log(time() + " - Датчик разбития окон в 2 комнате отключен");
      s_gc[1] = "N/A";
      clearInterval(sims[3]);
    }
  });

  $("#door_detect_1").change(() => {
    if ($("#door_detect_1").is(":checked")) {
      log(time() + " - Датчик открытия двери в 1 комнате включен");
    } else {
      log(time() + " - Датчик открытия двери в 1 комнате отключен");
    }
  });

  $("#door_detect_2").change(() => {
    if ($("#door_detect_2").is(":checked")) {
      log(time() + " - Датчик открытия двери в 2 комнате включен");
    } else {
      log(time() + " - Датчик открытия двери в 2 комнате отключен");
    }
  });

  var move_d_1 = document.getElementById("move_1_chart").getContext("2d");
  var move_d_2 = document.getElementById("move_2_chart").getContext("2d");
  var window_d_1 = document.getElementById("window_1_chart").getContext("2d");
  var window_d_2 = document.getElementById("window_2_chart").getContext("2d");

  var myChart1 = new Chart(move_d_1, {
    type: "line",
    data: {
      datasets: [
        {
          label: "",
          borderColor: "Blue",
          fill: false,
        },
      ],
    },
    options: {
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: "second",
              displayFormats: {
                second: "HH:mm:ss",
              },
            },
            scaleLabel: {
              display: true,
              labelString: "Время",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Расстояние",
            },
          },
        ],
      },
    },
  });

  var myChart2 = new Chart(move_d_2, {
    type: "line",
    data: {
      datasets: [
        {
          label: "",
          borderColor: "Red",
          fill: false,
        },
      ],
    },
    options: {
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: "second",
              displayFormats: {
                second: "HH:mm:ss",
              },
            },
            scaleLabel: {
              display: true,
              labelString: "Время",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Расстояние",
            },
          },
        ],
      },
    },
  });

  var myChart3 = new Chart(window_d_1, {
    type: "line",
    data: {
      datasets: [
        {
          label: "",
          borderColor: "Black",
          fill: false,
        },
      ],
    },
    options: {
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: "second",
              displayFormats: {
                second: "HH:mm:ss",
              },
            },
            scaleLabel: {
              display: true,
              labelString: "Время",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Частота, ГЦ",
            },
          },
        ],
      },
    },
  });

  var myChart4 = new Chart(window_d_2, {
    type: "line",
    data: {
      datasets: [
        {
          label: "",
          borderColor: "Black",
          fill: false,
        },
      ],
    },
    options: {
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              unit: "second",
              displayFormats: {
                second: "HH:mm:ss",
              },
            },
            scaleLabel: {
              display: true,
              labelString: "Время",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Частота, ГЦ",
            },
          },
        ],
      },
    },
  });
});
