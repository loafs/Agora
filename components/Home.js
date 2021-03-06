import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  RefreshControl
} from 'react-native';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Icon from  'react-native-vector-icons/MaterialIcons'
import EvilIcon from  'react-native-vector-icons/EvilIcons'
import Ionicon from  'react-native-vector-icons/Ionicons'
import Topic from './Topic'
import s from './widgets/Styles'
const {height, width} = Dimensions.get('window')
import TextModal from './widgets/TextModal'
import { Card } from './widgets/Card'
import { SIP } from '../config/index'
import { createTopic } from '../actions/TopicAction'
import Mapbox,{ MapView } from 'react-native-mapbox-gl';
Mapbox.setAccessToken('pk.eyJ1IjoiY2hlemhlMTQzIiwiYSI6ImNpdHV4ZnU3dDAwMGIzb3A2ZDY4dXB1cHcifQ.lNI7a0-kJ8u_AXE4yIJVXg');
import Spinner from 'react-native-spinkit';

class Home extends Component {
  constructor(props){
    super(props)
    this.state = {
      textModalVisible: false,
      mapModal: false,
      content: "",
      addons: [],
      isRefreshing: false,
      scrollY: new Animated.Value(0)
    }
  }  

  parseContent(content){
    if (content.length > 16) {
      return content.subString(0,16)+'...'
    }else{
      return content
    }
  }
  render() {
    const { home,navigator,createTopic,fez } = this.props
    const { content, addons, textModalVisible,mapModal } = this.state

    this.annotations = home.topics.map((t)=>{
      return {
        coordinates: [t.location[1],t.location[0]],
        type: 'point',
        title: t.title,
        subtitle: t.content,
        rightCalloutAccessory: {
          source: { uri: `${SIP}images/view.png` },
          height: 60,
          width: 37
        },
        annotationImage: {
          source: { uri: `${SIP}images/topic.png` },
          height: 50,
          width: 50
        },
        id: t._id
      }
    })
    const location = fez.location
    
    return (
      <View style={s.root}>
        {textModalVisible && (
          <TextModal title="话题" submit={(content,addons,title)=>{
            createTopic({
              content,
              addons,
              title,
              date: new Date(),
              author: {
                id: fez._id,
                nickname: fez.nickname,
                avatarUrl: fez.avatarUrl
              },
              location: [location.longitude,location.latitude]
            })
          }} btnText="发布" titleInput={true} hide={()=>{ this.setState({textModalVisible:false});}}/>
        )}
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={mapModal}
          onRequestClose={() => {}}
          >
          <View style={s.topicModal}>
            <TouchableOpacity style={{flexDirection:'column',alignItems:'flex-end',width:width*0.95}} onPress={()=>{
              this.setState({mapModal: false});
            }}>
              <EvilIcon name="close-o" size={50} color="#999"/>
            </TouchableOpacity>
            <View style={s.rowCenter}>
              <MapView 
                style={s.map}
                initialCenterCoordinate={fez.location}
                initialZoomLevel={14}
                initialDirection={0}
                rotateEnabled={false}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                annotationsPopUpEnabled={true}
                showsUserLocation={false}
                userTrackingMode={Mapbox.userTrackingMode.follow}
                userLocationVerticalAlignment={Mapbox.userLocationVerticalAlignment.center}
                styleURL={Mapbox.mapStyles.light}
                logoIsHidden={true}
                compassIsHidden={true}
                annotations={this.annotations}
                onRightAnnotationTapped={(anno)=>{
                  this.setState({mapModal: false});
                  navigator.push({
                    id: 'nav',
                    nav: <Topic navigator={navigator} topicId={anno.id}/>,
                  })
                }}
                />
            </View>
          </View>
        </Modal> 
        <ScrollView 
          style={s.topicsContainer}
          bounces={true}
          automaticallyAdjustContentInsets={false}
          scrollEventThrottle={16}
          contentContainerStyle={s.topicsContentStyle}
          pagingEnabled={false}
          onScroll={(e)=>{
            console.log(e.nativeEvent);
          }}
          refreshControl={
            <RefreshControl
              refreshing={home.loadingNextPage}
              onRefresh={()=> this.props.refresh()}
              tintColor="#fff"
              title="加载中..."
              titleColor="#fff"
              colors={['#fff', '#fff', '#fff']}
              progressBackgroundColor="#fff"
            />
          }
          >
          {home.loadingNextPage && (
            <Spinner style={[s.spinner,{marginTop: -60}]} isVisible={true} size={80} type={'WordPress'} color={'#008cd5'}/>
          )}
          {home.topics.map((t,idx)=>{            
            return (
              <Card
                edge={false}
                key={idx}
                t={t}
                type={'topic'}
                press={()=>{
                  navigator.push({
                    id: 'nav',
                    nav: <Topic navigator={navigator} topicId={t._id}/>,
                  })
                }}/>
            )
          })}
          <View style={{height: 50, width, backgroundColor:'white'}}></View>
        </ScrollView>

        <View style={s.floatMenu}>
          <TouchableOpacity onPress={()=> this.setState({mapModal:true})}>
            <View style={[s.floatMenuItem,{}]}>
              <Ionicon name="ios-map-outline" size={20} color="black" />
              <Text style={{marginLeft: 4,fontSize: 14}}>地图</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> this.setState({textModalVisible:true})}>
            <View style={[s.floatMenuItem,{borderLeftWidth:1,marginLeft: 5,paddingLeft:10}]}>
              <Text style={{marginRight: 4,fontSize: 14}}>说两句</Text>
              <Ionicon name="ios-add-circle-outline" size={20} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    home: state.home,
    fez: state.fez
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createTopic: bindActionCreators(createTopic, dispatch)
    
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)


// <TouchableOpacity>
//             <View style={s.floatMenuItem}>
//               <Ionicon name="options-outline" size={30} color="black" />
//               <Text>筛选</Text>
//             </View>
//           </TouchableOpacity>
          