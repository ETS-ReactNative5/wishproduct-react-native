import React, {useState} from 'react';
import {RouteComponentProps} from 'react-router-native';
import {Dispatch} from 'redux';
import {View, ViewStyle, StyleSheet, TextStyle, Image, ImageBackground, Text, ScrollView, SafeAreaView} from 'react-native';
import {AppConstants, AppTheme} from '../../config/DefaultConfig';
import useConstants from '../../hooks/useConstants';
import RoundButton from '../../components/Base/RoundButton';
import FooterNavigation from '../Footer/Index';
import useTheme from '../../hooks/useTheme';
import {AppLanguage} from '../../config/languages';
import useLanguage from '../../hooks/useLanguage';
import HomeTrendProduct from './HomeTrendProduct';
import apiService from '../../services/apiService';
import appService from '../../services/appService';
import {useEffect} from 'react';
import HomeBestSellProduct from './HomeBestSellProduct';
import HomeBrandLogo from './HomeBrandLogo';

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  history;
}

const Home: React.FunctionComponent<Props> = ({history}: Props) => {
  const constants: AppConstants = useConstants();
  const theme: AppTheme = useTheme();
  const language: AppLanguage = useLanguage();
  const [listTrendItems, setListTrendItems] = useState([]);
  const [listBestSellItems, setListBestSellItems] = useState([]);
  const [listBrands, setListBrands] = useState([]);

  useEffect(() => {
    Promise.all([
      apiService.get('/v1/homepage/items/feature?page=0&limit=10'),
      apiService.get('/v1/homepage/items/body?page=0&limit=10'),
      apiService.get('/v1/stores?page=0&limit=30'),
    ]).then(result=>{
      let [_resTrenditems, _bestsell, _brands] = result;
      let resTrenditems = appService.getResultApiPaging(_resTrenditems);
      let trendingItems = resTrenditems.items.map(r => {
        r = appService.parseProductPrice(r);
        r = appService.parseThumbnails(r);
        return r;
      });
      setListTrendItems(trendingItems);
  
      let resBestSell = appService.getResultApiPaging(_bestsell);
      let bestSellItems = resBestSell.items.map(r => {
        r = appService.parseProductPrice(r);
        r = appService.parseThumbnails(r);
        return r;
      });
      setListBestSellItems(bestSellItems);
  
      let resBrands = appService.getResultApiPaging(_brands);
      let brands = resBrands.items.map(r => {
        r = appService.parseProductPrice(r);
        r = appService.parseThumbnails(r);
        return r;
      });
      setListBrands(brands);
    });
  }, []);

  const gotoProducts = () => {
    history.push('/shopping');
  };
  const gotoViewAll = () => {
    history.push('/shopping');
  };

  const gotoProductDetails = () => {
    history.push('/productDetails');
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: 0,
        margin: 0,
      }}>
      <ScrollView style={style.secondView}>
        <View style={style.newItemList}>
          <View style={style.newItemListLabel}>
            <Text style={[style.leftLabel, {color: theme.labelBgColor}]}>{constants.homePage.labelHotTrend}</Text>
            <Text style={[style.rightLabel, {color: theme.activeColor}]} onPress={gotoViewAll}>
              {constants.homePage.labelViewAll}
            </Text>
          </View>
          <View style={style.newItemBox}>
            {listTrendItems && listTrendItems.length > 0 ? (
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {listTrendItems.map((item, idx) => {
                  return (
                    <View key={item.id} style={{zIndex: 9}}>
                      <HomeTrendProduct item={item} goToDetails={gotoProductDetails} />
                    </View>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>
        </View>

        <View style={style.newItemList}>
          <View style={style.newItemListLabel}>
            <Text style={[style.leftLabel, {color: theme.labelBgColor}]}>{constants.homePage.labeBestSell}</Text>
            <Text style={[style.rightLabel, {color: theme.activeColor}]} onPress={gotoViewAll}>
              {constants.homePage.labelViewAll}
            </Text>
          </View>
          <View style={style.newItemBox}>
            {listBestSellItems && listBestSellItems.length > 0 ? (
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {listBestSellItems.map((item, idx) => {
                  return (
                    <View key={item.id} style={{zIndex: 9}}>
                      <HomeBestSellProduct item={item} goToDetails={gotoProductDetails} />
                    </View>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>
        </View>

        <View style={style.newItemList}>
          <View style={style.newItemListLabel}>
            <Text style={[style.leftLabel, {color: theme.labelBgColor}]}>{constants.homePage.labeBrandLogo}</Text>
          </View>
          <View style={style.newItemBox}>
            {listBrands && listBrands.length > 0 ? (
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {listBrands.map((item, idx) => {
                  return (
                    <View key={item.id} style={{zIndex: 9}}>
                      <HomeBrandLogo item={item} goToDetails={null} />
                    </View>
                  );
                })}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <FooterNavigation history={history} />
    </SafeAreaView>
  );
};

export default Home;

const style: any = StyleSheet.create<any>({
  mainContainer: {
    padding: 0,
    margin: 0,
    flex: 1,
  },
  secondView: {
    // flex: 1,
    // justifyContent: 'flex-start',
    marginHorizontal: 0,
  },

  newItemList: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  newItemListLabel: {
    flexDirection: 'row',
  },
  leftLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    textTransform: 'capitalize',
    paddingLeft: 5,
  },
  rightLabel: {
    flex: 1,
    textAlign: 'right',
    justifyContent: 'center',
    paddingTop: 10,
    paddingRight: 5,
  },
  newItemBox: {
    flex: 1,
    flexDirection: 'row',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 5,
    borderRadius: 0,
    // overflow: 'hidden',
  },
});
