import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Icon from  'react-native-vector-icons/MaterialIcons'
const {height, width} = Dimensions.get('window')
import s from './widgets/Styles'
import { fetchFezCreated,fetchFezFollowed,fetchTopicInArray } from '../actions/TopicAction'
import { Card } from './widgets/Card'
import { Header,SwipeHeader } from './widgets/Header'
import Topic from './Topic'

class History extends Component {
  constructor(props){
    super(props)
    this.state = {
      selected: 'followed'
    }
  }
  
  componentWillMount() {
    const { fez, home, fetchFezFollowed } = this.props
    fetchFezFollowed(fez.followed)
  }
  
  render() {
    const { tabs,home,fez,navigator,menuOpen,toggle,fetchTopicInArray } = this.props
    const { selected } = this.state
    const message = selected=='followed' ? "这里什么也没有，快去关注几条吧":"你还没发言呢"
    return (
      <View style={[s.root,{paddingTop: 10}]}>
        <SwipeHeader
          left={{
            icon: menuOpen ? "arrow-left" : "navicon",
            call: ()=>{ toggle() }
          }}
          swiper={tabs}
          selected={selected}
          select={(t)=>{
            this.setState({selected: t.key});
            if (home[t.key].length != fez[t.key].length) {
              switch(t.key){
                case "followed":
                  this.props.fetchFezFollowed(fez.followed)
                  break;
                case "created":
                  this.props.fetchFezCreated(fez.created)
                  break;
                default:
                  break;
              } 
            }
          }}
          />
        <ScrollView style={s.topicsContainer} bounces={true} automaticallyAdjustContentInsets={false} scrollEventThrottle={200} contentContainerStyle={s.topicsContentStyle}>
          {home[selected].map((t,idx)=>{
            if (!fez[selected].includes(t._id)) {
              return null
            }
            return (
              <Card
                navigator={navigator}
                key={idx}
                t={t}
                type={'history'}
                press={()=>{
                  const tid = t.topicId || t._id
                  navigator.push({
                    id: 'nav',
                    nav: <Topic navigator={navigator} topicId={tid}/>,
                  })
                }}/>
            )
          })}
          {home[selected].length==0 && (
            <View style={{alignSelf:'center',marginTop: 100}}>
              <Text style={[s.deepGray,s.h2]}>
                {message}
              </Text>
            </View>            
          )}
        </ScrollView>
      </View>
    );
  }
}

History.defaultProps = {
  tabs: [{
    title: '关注',
    key: 'followed'
  },{
    title: '创建',
    key: 'created'
  },]
}


function mapStateToProps(state) {
  return {
    home: state.home,
    fez: state.fez
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchTopicInArray: bindActionCreators(fetchTopicInArray, dispatch),
    fetchFezCreated: bindActionCreators(fetchFezCreated, dispatch),
    fetchFezFollowed: bindActionCreators(fetchFezFollowed, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(History)
