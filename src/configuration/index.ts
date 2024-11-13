export default {
  fancy: {
    topic: "sb_fancy01_",
    eventTtl: 3600,
  },
  redis: {
    client: {
      clientFrontEndSub: process.env.REDIS_FE_URL + '_subscribe',
      clientFrontEndPub: process.env.REDIS_FE_URL + '_publish',
      clientFrontEnd: process.env.REDIS_FE_URL,
      clientBackEnd: process.env.REDIS_BE_URL,
      clientBackendEndPub: process.env.REDIS_BE_URL + '_publish',
    }
  },
}
