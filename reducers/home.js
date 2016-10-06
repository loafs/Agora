import {
  FETCH_TOPICS,
  NEW_COZE,
  FETCH_COZES,
  FETCH_FEZ_JOINED,
  FETCH_FEZ_CREATED,
  FETCH_FEZ_VIEWED,
  OTHEZ
} from '../config/ActionTypes'
import _ from 'lodash'

const initial = {
  topics:[],
  cozes: [],
  joined: [],
  viewed: [],
  created: [],
  tome: [],
  tojoined: [{
    author: {
      nickname: '刘德华',
      avatarUrl: '../assets/avatar.png',
      id: ''
    },
    to:{
      id: 'a2',
      author: {
        id: '',
        nickname: '万青'
      },
      content: '那东西我们早就不屑啦',
      date: (new Date()).toLocaleTimeString()
    },
    content: '去你的',
    addons: [],
    date: (new Date()).toLocaleTimeString()
  }],
  othez: []
}
export default function home(state=initial,action){
  switch(action.type){
    case OTHEZ:
      return Object.assign({},state,{
        othez: _.uniq(state.othez.concat(action.othez),(t)=> t._id)
      })
    case FETCH_FEZ_CREATED:
      return Object.assign({},state,{
        created: action.topics
      })
    case FETCH_FEZ_JOINED:
      return Object.assign({},state,{
        joined: action.topics
      })
    case FETCH_FEZ_VIEWED:
      return Object.assign({},state,{
        viewed: action.topics
      })
    case NEW_COZE:
      return Object.assign({},state,{
        cozes: [...state.cozes,action.coze]
      })
    case FETCH_COZES:
      return Object.assign({},state,{
        cozes: action.cozes.map((t)=>{
          const fezs = state.othez.filter((f)=> f._id==t.author.id)
          let author = {}, toauthor={}
          if (fezs.length == 1) {
            author = {
              nickname: fezs[0].nickname,
              avatarUrl: fezs[0].avatarUrl,
              id: t.author.id
            }
          }
          return Object.assign({},t,{
            author
          })
        })
      })
    case FETCH_TOPICS:
      return Object.assign({},state,{
        topics: action.topics.map((t)=>{
          const fezs = state.othez.filter((f)=> f._id==t.author.id)
          let author = {}
          if (fezs.length == 1) {
            author = {
              nickname: fezs[0].nickname,
              avatarUrl: fezs[0].avatarUrl,
              id: t.author.id
            }
          }
          return Object.assign({},t,{
            author
          })
        })
      })
    default:
      return state
  }
}