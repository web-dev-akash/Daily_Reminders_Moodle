const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const app = express();
app.use(express.json());
const wstoken = process.env.WSTOKEN;
const url = `https://wisechamps.app/webservice/rest/server.php`;
const watiAPI = `https://live-server-105694.wati.io`;
const token = process.env.WATI_TOKEN;

// const timeConvertor = (timestamp) => {
//   dateObj = new Date(timestamp * 1000);
//   utcString = dateObj.toLocaleTimeString("en-US");
//   return utcString;
// };

const sendReminders = async () => {
  //   let finalData = [];
  //   let eventsOfTheDay = [];
  //   const res = await axios.get(
  //     `${url}?wstoken=${wstoken}&wsfunction=core_course_get_courses_by_field&[options][ids]&moodlewsrestformat=json`
  //   );
  //   const data = res.data.courses;
  //   const filteredData = data.filter((response) => {
  //     return (
  //       response.shortname.includes("OB") || response.shortname.includes("OE")
  //     );
  //   });
  //   for (let i = 0; i < filteredData.length; i++) {
  //     const courseID = filteredData[i].id;
  //     const courseName = filteredData[i].displayname;
  //     const users = await axios.get(
  //       `${url}?wstoken=${wstoken}&wsfunction=core_enrol_get_enrolled_users&courseid=${courseID}&moodlewsrestformat=json`
  //     );
  //     const object = {
  //       id: courseID,
  //       name: courseName,
  //       users: users.data,
  //     };
  //     finalData.push(object);
  //   }
  //   var start = new Date();
  //   start.setUTCHours(0, 0, 0, 0);

  //   var end = new Date();
  //   end.setUTCHours(23, 59, 59, 999);

  //   let startTime = start.valueOf() / 1000;
  //   let endTime = end.valueOf() / 1000;
  //   startTime = startTime.toFixed(0);
  //   endTime = endTime.toFixed(0);

  //   for (let i = 0; i < filteredData.length; i++) {
  //     const courseID = filteredData[i].id;
  //     const event = await axios.get(
  //       `${url}?wstoken=${wstoken}&&wsfunction=core_calendar_get_calendar_events&events[courseids][0]=${courseID}&options[timestart]=${startTime}&options[timeend]=${endTime}&moodlewsrestformat=json`
  //     );
  //     let object = event.data;
  //     if (object.events.length > 0) {
  //       eventsOfTheDay.push(object);
  //     }
  //   }

  //   const remindersData = [];
  //   for (let i = 0; i < eventsOfTheDay.length; i++) {
  //     let course = [];
  //     let event = eventsOfTheDay[i].events[0];
  //     const startTime = Number(event.timestart) - 3600;
  //     let time = timeConvertor(startTime);
  //     course = finalData.filter((resp) => {
  //       return resp.id == event.courseid;
  //     });
  // console.log(course);
  // const user = course[0].users;
  // for (let j = 0; j < user.length; j++) {
  //   let student_name = user[j].fullname;
  //   let parent_email = user[j].email;
  //   let subject_name = course[0].name;
  //   let number = user[j].phone1;
  // }
  const remindersData = [];
  const obj1 = {
    customParams: [
      {
        name: "name",
        value: "Parent",
      },
      {
        name: "student_name",
        value: "student_name",
      },
      {
        name: "subject_name",
        value: "subject_name",
      },
      {
        name: "program_name",
        value: "class",
      },
      {
        name: "time",
        value: "time",
      },
      {
        name: "parent_email",
        value: "parent_email",
      },
    ],
    whatsappNumber: `917018178377`,
  };
  remindersData.push(obj1);

  const body = {
    broadcast_name: "classReminders",
    receivers: remindersData,
    template_name: "reminders",
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/json",
    },
    body: JSON.stringify(body),
  };
  fetch(`${watiAPI}/api/v1/sendTemplateMessages`, options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    });

  return remindersData;
};

cron.schedule(
  "35 12 * * 1-6",
  async () => {
    await sendReminders();
    console.log("Reminders sent successfully for today");
  },
  {
    timezone: "Asia/Kolkata",
  }
);

// app.get("/", async (req, res) => {
//   try {
//     const reminders = await sendReminders();
//     return res.status(200).send({
//       status: "success",
//       reminders,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       status: "error",
//       error,
//     });
//   }
// });

app.listen(3000, () => {
  console.log("Server Started at http://localhost:3000");
});
