import {  StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',
    // alignItems: 'center',
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#e9f7fd'
  },
  containerListVatTu: {
    flex: 1,
    width:'100%',
    // alignItems: 'center',
    // alignItems: 'stretch',
    // justifyContent: 'center',
    backgroundColor: '#e9f7fd',
    flexDirection:'column',
    // height: 'auto', flex: 0,
  },
  containerFormSearch: {
    flex: 1,
    width:'100%',
    // alignItems: 'center',
    // alignItems: 'stretch',
    // justifyContent: 'center', 
    backgroundColor: '#e9f7fd',
    flexDirection:'column',
    // height: 'auto', flex: 0,
  },
  ngSelectStyle:{
    marginLeft:10,
    marginRight:10,
    marginTop:5,
    marginBottom:5,
    paddingTop:5,
    paddingBottom:5,
    fontSize:12,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  preview: {
    flex: 1,
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  textLabel:{
    textAlign: 'left', 
    paddingLeft:0, 
    marginLeft:10, 
    marginTop:5,
    color:'black',
    fontSize:14,
    fontWeight:'bold',
  }
});
export default styles;