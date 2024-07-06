import { View, Text, StyleSheet } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import LottieView from 'lottie-react-native'
import CustomTextInput from '../components/CustomTextInput'
import TaskNameIcon from '../assets/images/SearchIcon.png'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DropDownPicker from 'react-native-dropdown-picker'
import colors from '../themes/Colors'
import CustomButton from '../components/CustomButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation, useRoute } from '@react-navigation/native'
import ScreenName from '../constants/ScreenName'
import uuid from 'react-native-uuid';
import Toast from 'react-native-toast-message';





export default function AddTaskScreen() {
    const navigation = useNavigation();

    //!useroute un görevi key, params, parametreleri, sayfanın ismini alır
    const route = useRoute();
    //console.log(route);
    const { data } = route.params || {};

    const [title, setTitle] = useState(data?.title || '')
    //console.warn(title)


    //!BU DOPRDOWN İÇİNDİR VE KUTUPHANEDEN ALINDI
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(data?.status || null);// datada status varsa getir yoksa null getir
    const [startDate, setStartDate] = useState(data?.startDate || ''); //başlama tarihi
    const [endDate, setEndDate] = useState(data?.endDate || '');//bitiş tarihi
    const [items, setItems] = useState([
        { label: 'Open', value: 'open' },
        { label: 'Progress', value: 'progress' },
        { label: 'Pending', value: 'pending' },
        { label: 'Closed', value: 'closed' },
    ]);

    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);

    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

    // mesela kalem oikonuna tıklamadan bunu görelim arka planda çalışıyor layout,senkron olarak çalışıyor
    useLayoutEffect(() => {
        navigation.setOptions({
            title: data ? 'Update Task' : 'Add Task'
        })
    }, [navigation, data])

    //!BUNLAR TARİH ONAYI İÇİN. 
    //tarih onayı için state açılsınmı aöılmasınmı state i
    //const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showStartDatePicker = () => {
        setStartDatePickerVisibility(true);
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisibility(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisibility(false);
    };

    const handleConfirmStartDate = date => {
        // console.warn(date);
        setStartDate(date.toString());
        hideStartDatePicker();
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisibility(false);
    };

    //bu fonksiyon açılan modalden tarihi seçince ototmaitk olarak seçilen tarihi tarih inputuna atıyor ve modali kapatıyor
    const handleConfirmEndDate = date => {
        setEndDate(date.toString());
        hideEndDatePicker();
    };
    //!bunu yaptık artık ihtiyacımız kalmadı
    // const showDatePicker = () => {
    //  setDatePickerVisibility(true)
    // }
    //console.log(isDatePickerVisible)

    //!bunlara itiyac kalmadı
    // const hideDatePicker = () => {
    //     setDatePickerVisibility(false);
    // }
    // //!BUNU TARİH İÇİN KÜTÜPHANEDEN KOPYALADIK
    // const handleConfirm = date => {
    //     console.warn("A date has been picked: ", date);
    //     hideDatePicker();
    // };

    //!ASYNCSTORAGE TASK KAYDETMEK EKLEME
    const handleAddTask = async () => {
        // gerekli alanları kontrol et(bunlar yoksa olmaz)
        if (!title || !startDate || !endDate || !value) {
            Toast.show({
                type: 'info',
                text1: 'Bilgi',
                text2: 'Lütfen tüm alanları doldurunuz',
                topOffset: 60,
            })
            return;
        }
        //yeni eklediğimiz taskın objesini oluşturduk
        const newTask = {
            id: data?.id || uuid.v4(),
            title, // title:title böylede yazılabilir js son sürümde value ve isimaynıysa tekte yazılabilir
            startDate,
            endDate,
            status: value,
        }
        try {
            //asyncron storage da tasks verileri varsa al
            const existingTasks = await AsyncStorage.getItem('tasks');
            // veri varsa bunu jsona çevir yoksa boş dizi ver
            let tasks = existingTasks ? JSON.parse(existingTasks) : [];


            // yukarıda const ile data tanımladık bunnu önce boş taımladık sonra dolduracağız.güncelleme işlemi yaparken bazı verileri almamız gerekecek
            if (data) { //eğer data geliyorsa bunu maple eski hali data idsi ile dışarıdan gönderdiğim data birbirine eşit se yeni taskı yine gönder, yoksa eski task yine kalsın.
                tasks = tasks.map(task => (task.id === data.id ? newTask : task));
            } else {
                // data yoksa yeni oluşturulan veriyi tasks dizisine ekle
                tasks.push(newTask);
            }
            //veri varsa alalım(veri varsa veriyi task şeklinde ekle,veriyi asycronstorage string olarak ekle)
            await AsyncStorage.setItem('tasks', JSON.stringify(tasks))

            Toast.show({
                type: 'success',
                text1: data ? 'Task güncellendi!' : 'Task eklendi!',
                topOffset: 60,
            })

            //sonra bizi anasayfaya yönlendir
            navigation.navigate(ScreenName.taskList)
        } catch (error) {
            //hata varsa yakalayalım
            console.log(error, 'failled to save task')

        }
    }
    // console.warn(value)
    //console.warn(title)
    return (
        <View style={styles.container}>
            <View style={styles.inlineContainer}>
                <View style={styles.taskImageContainer}>
                    <LottieView
                        autoPlay
                        loop
                        style={{ height: 150, width: '100%' }}
                        source={require('../assets/animations/pencil.json')} />
                </View>
                <CustomTextInput
                    imageSource={TaskNameIcon}
                    label={'Task Adı'}
                    onChangeText={setTitle}
                    value={title}
                />
                <View style={{ flexDirection: 'row' }}>

                    <CustomTextInput
                        onPressIcon={() => showStartDatePicker()}
                        imageSource={TaskNameIcon}
                        style={{ width: '40%' }}
                        label={'Başlangıç Tarihi'}
                        onChangeText={setStartDate}
                        isDate
                        value={startDate}
                    />

                    <CustomTextInput onPressIcon={() => showEndDatePicker()}
                        imageSource={TaskNameIcon}
                        style={{ width: '40%' }}
                        label={'Bitiş Tarihi'}
                        isDate
                        value={endDate}
                        onChangeText={setEndDate}
                    />
                </View>
                <View style={styles.dropdownContainer}>
                    <View>
                        <Text style={styles.status}>Status</Text>
                        <DropDownPicker
                            listMode='SCROLLVIEW'
                            open={open}
                            value={value}
                            items={items}
                            setOpen={setOpen}
                            setValue={setValue}
                            setItems={setItems}
                            containerStyle={{ width: '90%' }}
                            style={{ borderWidth: 0, }}
                        />
                    </View>
                </View>

            </View>

            <CustomButton
                onPress={handleAddTask}
                label={data ? 'Update Task' : 'Save Task'}
                style={{ width: '95%' }}
            />

            <DateTimePickerModal
                //onCancel={hideDatePicker} önce böyleydi
                onCancel={hideStartDatePicker}
                //isVisible={isDatePickerVisible} böyleydi
                isVisible={isStartDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmStartDate}
            />
            <DateTimePickerModal
                //onCancel={hideDatePicker} önce böyleydi
                onCancel={hideEndDatePicker}
                //isVisible={isDatePickerVisible} böyleydi
                isVisible={isEndDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirmEndDate}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
        alignItems: 'center'
    },
    inlineContainer: {
        width: '100%',
    },
    taskImageContainer: {
        marginTop: 60,
    },
    dropdownContainer: {
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        marginBottom: 210,
    },
    status: {
        fontSize: 15,
        marginBottom: 5,
        fontWeight: '600',
        color: colors.text.primary,
    },
})