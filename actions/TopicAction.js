import {
  FETCH_TOPICS,
  FETCH_NOTICE,
  JOIN_TOPIC,
  VIEW_TOPIC,
  FETCH_COZES,
  NEW_COZE,
  NEW_TOPIC,
  FETCH_FEZ_JOINED,
  FETCH_FEZ_CREATED,
  FETCH_TOPIC_IN_ARRAY,
  FETCH_FEZ_FOLLOWED,
  OTHEZ,
  REPORT
} from '../config/ActionTypes'
import axios from 'axios'
import { io } from '../store/io'
import { SIP } from '../config/index'

export function fetchTopics(meta){
  io.emit('fetchNearTopics', meta)
  return (dispatch)=>{
    io.on('nearTopicsFetched',(data)=>{
      dispatch(addOthez(data.fezs))
      dispatch(topicsFetched(data.topics))
    })
    // axios.get(`${SIP}topic`,{
    //   params: {
    //     long,
    //     lat,
    //     page
    //   }
    // }).then((response) => {
    //     dispatch(topicsFetched(response.data))
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }
}

function topicsFetched(topics){
  return {
    type: FETCH_TOPICS,
    topics
  }
}

export function fetchCozes(topicId, id){
  io.emit('fetchTopicById',{
    tid: topicId
  })
  return (dispatch)=>{
    io.on('topicByIdFetched',(rd)=>{
      dispatch(addOthez(rd.fezs))
      const cozes = [rd.topic].concat(rd.cozes)
      dispatch(cozesFetched(cozes))
    })
    // axios.get(`${SIP}topic/${topicId}`,{
    //   id
    // }).then((response) => {
    //   const rd = response.data
    //   dispatch(cozesFetched([rd.topic].concat(rd.cozes)))
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  }
}

function cozesFetched(cozes){
  return {
    type: FETCH_COZES,
    cozes
  }
}

export function createTopic(one){
  console.log(one);
  return (dispatch)=>{
    axios.put(`${SIP}topic`, one).then((response) => {
        dispatch(topicCreated(response.data))
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function topicCreated(one){
  return {
    type: NEW_TOPIC,
    one
  }
}

export function createCoze(topicId, one, joined,cozeTo){
  const urlto = joined ? 'continueTopic' : 'joinTopic'
  io.emit(urlto, {
    coze: Object.assign({}, one, {
      topicId
    }),
    cozeTo
  })
  return (dispatch)=>{
    if (!joined) {
      dispatch(topicJoined(topicId))
    }
    io.on('cozeCreated',(data)=>{
      dispatch(cozeCreated( Object.assign({},one,{
        _id: data.cid,
        topicId
      })))
    })
    // const urlto = joined ? 'topic' : 'join'
    // axios.put(`${SIP}${urlto}/${topicId}`,one).then((response) => {
    //     dispatch(cozeCreated( Object.assign({},one,{
    //       _id: response.data,
    //       topicId
    //     })))
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }
}

function cozeCreated(coze){
  return {
    type: NEW_COZE,
    coze
  }
}

export function fetchTopicInArray(tids, type, uid){
  io.emit('fetchTopicInArray',{
    tids
  })

  return (dispatch)=>{
    io.on('topicInArrayFetched',(data)=>{
      switch(type){
        case "joined":
          dispatch(fezJoinedFetched(data.topics))
          break;
        case "created":
          dispatch(fezCreatedFetched(data.topics))
          break;
        default:
          dispatch(fezFollowedFetched(data.topics))
          break;
      }
    })
  }
}

export function fetchFezFollowed(all){
  return (dispatch)=>{
    axios.get(`${SIP}topics`,{
      params: {all:all}
    })
      .then((response) => {
        dispatch(fezFollowedFetched( response.data ))
      }).catch((error) => {
        console.log(error);
      });
  }
}

function fezFollowedFetched(topics){
  return {
    type: FETCH_FEZ_FOLLOWED,
    topics
  }
}

export function fetchFezJoined(uid){
  return (dispatch)=>{
    axios.get(`${SIP}joined/${uid}`)
      .then((response) => {
        const rd = response.data
        const cozes = rd.cozes.map((t)=>{
          const topic = rd.topics.filter((tp)=>tp._id==t.topicId)
          if (topic.length==1) {
            return Object.assign({},t,{
              topicTitle: topic[0].content,
              showTitle: true
            })
          }
        })
        console.log(cozes);
        dispatch(fezJoinedFetched( cozes ))
      }).catch((error) => {
        console.log(error);
      });
  }
}

function fezJoinedFetched(topics){
  return {
    type: FETCH_FEZ_JOINED,
    topics
  }
}

export function fetchFezCreated(all){
  return (dispatch)=>{
    console.log(all);
    axios.get(`${SIP}topics`,{
      params: {all}  
    })
      .then((response) => {        
        dispatch(fezCreatedFetched( response.data ))
      }).catch((error) => {
        console.log(error);
      });
  }
}

function fezCreatedFetched(topics){
  return {
    type: FETCH_FEZ_CREATED,
    topics
  }
}

function topicJoined(tid){
  return {
    type: JOIN_TOPIC,
    tid
  }
}

function addOthez(othez){
  return {
    type: OTHEZ,
    othez
  }
}

export function reportCoze(one){
  return (dispatch)=>{
    axios.put(`${SIP}report`,one).then((response) => {        
        dispatch(cozeReported( response.data.code ))
      }).catch((error) => {
        console.log(error);
      });
  }
}

function cozeReported(code){
  return {
    type: REPORT
  }
}