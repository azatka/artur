$(document).ready(function () {
  setInterval(() => {
    $("#time").text(time());
  }, 500);

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

  var err = [false, false];
  var err1 = [false, false];
  var point = [6, 6];
  var recovery = [false, false];
  var interval, interval2;

  let timer1 = (sec) => {
    setTimeout(() => {
      err[0] = false;
      recovery[0] = true;
      var timeOfRecovery = setInterval(() => {
        if (point[0] == 6) {
          recovery[0] = false;
          log(time() + " - В комнате 1 джвижение прекращено!");
          clearInterval(timeOfRecovery);
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
      err[1] = false;
      recovery[1] = true;
      var timeOfRecovery = setInterval(() => {
        if (point[1] == 6) {
          recovery[1] = false;
          log(time() + " - В комнате 2 джвижение прекращено!");
          clearInterval(timeOfRecovery);
        } else {
          point[1]++;
          myChart2.data.datasets[0].data.push({ x: new Date(), y: point[1] });
          myChart2.update();
        }
      }, 1234);
    }, sec);
  };

  let chart1 = () => {
    let sim = setInterval(() => {
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
    let sim = setInterval(() => {
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
    let sim = setInterval(() => {
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
        }
      }
    }, 100);
  };

  let chart4 = () => {
    let sim = setInterval(() => {
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
        }
      }
    }, 100);
  };

  let clear = () => {
    if (!err[0]) {
      myChart1.data.datasets[0].data = [];
    }
    if (!err[1]) {
      myChart2.data.datasets[0].data = [];
    }
    if (!err1[0]) {
      myChart3.data.datasets[0].data = [];
    }
    if (!err1[1]) {
      myChart4.data.datasets[0].data = [];
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
      interval2 = setInterval(() => {
        addRow(1);
        addRow(2);
      }, 1000);

      interval = setInterval(() => {
        cycle();
      }, 3000);
    }
  });

  let cycle = () => {
    getDetectInfo();
    let rnd = Math.floor(Math.random() * (30 - 0) + 0);
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
    } else if (rnd==5 && door_detect[0]) {
      log(time() + " - В комнате 1 открыли дверь!");
    } else if (rnd==7 && door_detect[1]) {
      log(time() + " - В комнате 2 открыли дверь!");
    }
  };

  chart1();
  chart2();
  chart3();
  chart4();

  $("#stop").click(() => {
    if (status) {
      status = false;
      $("#start").prop("disabled", false);
      $("#stop").prop("disabled", true);
      log(time() + " - Система остановлена!");
      clearInterval(interval);
      clearInterval(interval2);
    }
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
    } else {
      log(time() + " - Датчик движения в 1 комнате отключен");
    }
  });

  $("#move_detect_2").change(() => {
    if ($("#move_detect_2").is(":checked")) {
      log(time() + " - Датчик движения в 2 комнате включен");
    } else {
      log(time() + " - Датчик движения в 2 комнате отключен");
    }
  });

  $("#window_detect_1").change(() => {
    if ($("#window_detect_1").is(":checked")) {
      log(time() + " - Датчик разбития окон в 1 комнате включен");
    } else {
      log(time() + " - Датчик разбития окон в 1 комнате отключен");
    }
  });

  $("#window_detect_2").change(() => {
    if ($("#window_detect_2").is(":checked")) {
      log(time() + " - Датчик разбития окон в 2 комнате включен");
    } else {
      log(time() + " - Датчик разбития окон в 2 комнате отключен");
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
