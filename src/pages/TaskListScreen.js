import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../themes/Colors';
import CustomTextInput from '../components/CustomTextInput';
import SearchIcon from '../assets/images/SearchIcon.png';
import TodoItem from '../components/TodoItem';
import CustomButton from '../components/CustomButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ScreenName from '../constants/ScreenName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import renderEmptyList from '../components/EmptyList';
import Toast from 'react-native-toast-message';





export default function TaskListScreen() {
    const navigation = useNavigation();

    //! customtextInputa girdiğimiz verileri almak için state tutuyoruz
    const [searchText, setSearchText] = useState('');
    //console.warn(searchText);

    //! liste yapısı oluşturmak için kullandığımız usestate
    const [tasks, setTasks] = useState([
        // {
        //     userId: 4,
        //     id: 4,
        //     title: 'title',
        //     status: 'closed',
        // },
        // {
        //     userId: 5,
        //     id: 5,
        //     title: 'title',
        //     status: 'closed',
        // },
        // {
        //     userId: 6,
        //     id: 6,
        //     title: 'title',
        //     status: 'closed',
        // },
        // {
        //     userId: 7,
        //     id: 7,
        //     title: 'title',
        //     status: 'open',
        // },//!bunu loadTasks ta state güncelleme olayını yaptıktan sonra sildik.

    ]);

    const [filteredTasks, setFilteredTasks] = useState([])
    //? asenkronstorage temizlemek için bu fonksiyonu yazdık sonra sileceğiz
    // const clearAll = async () => {
    //     try {
    //         await AsyncStorage.clear();
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }
    // ne zaman asenksronstorage temizlemek için bu fonksiyon çalışsın sayfa yenilendiğinde
    // useEffect(() => {
    //     clearAll();
    // }, [])

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, []),
    )

    useEffect(() => {
        filterTasks();
    }, [searchText, tasks])


    //! sayfa yüklenildiği anda bi fonksiyon çalıştıralım bu foksiyon içerisinede asenkron fonksiyon içerisine verileri alalım.
    const loadTasks = async () => {
        try {
            // AsyncStorage da tasksları al
            const existingTasks = await AsyncStorage.getItem('tasks');
            // task varsa bunu jsona çevir yoksada boş dizi ver
            const tasks = existingTasks ? JSON.parse(existingTasks) : [];
            //state güncelle
            setTasks(tasks);
            //console.log(existingTasks);
        } catch (error) {
            console.log(error);
        }
    }
    //loadTasks();

    const filterTasks = () => {
        if (searchText) {
            //taskların titleı seacrhtext ile eşleşirse dizi olarak ver
            const filtered = tasks.filter(task => task.title.toLowerCase().includes(searchText.toLowerCase()),
            );
            // filtrelenmiş diziyi state aktar
            setFilteredTasks(filtered);
            // console.log(filtred);
        } else {
            //searchtext boş ise taskların hepsini ekrana bastır
            setFilteredTasks(tasks);
        }
    }
    //filterTasks();

    //!bu fonksiyon delete tuşuna basınca çalışacak
    const handleDeleteTask = async id => {
        try {
            //filterle taskları dön bu taskların idsi ile benim dışarıdan gönderdiğim id birbirine eşit değilse bunu çıkar ve bunu bana dizi olarak ver updatedtask olarak
            const updatedTasks = tasks.filter(task => task.id !== id)
            //task stateini güncelle
            setTasks(updatedTasks);

            //asenkronstorage güncelle
            await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
            Toast.show({
                type: 'error',
                text1: 'Task Silindi!',
                topOffset: 60,
            });
        } catch (error) {
            console.log(error, 'Failed to delete task')
        }
        // console.warn('id', id);
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Tasks</Text>
        </View>

    )

    return (
        <View style={styles.container}>
            <View style={styles.mainContentContainer}>
                <SafeAreaView style={[styles.container, { marginBottom: 20 }]}>
                    <CustomTextInput
                        value={searchText}
                        onChange={setSearchText}
                        imageSource={SearchIcon}
                        style={{ marginHorizontal: 0 }}
                        placeholder="Task ara"
                    />
                    <FlatList
                        keyExtractor={item => item?.id.toString()}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={renderEmptyList}//bunu dökümandan yazdık
                        data={tasks}
                        renderItem={({ item }) => (
                            <TodoItem data={item} onDelete={() => handleDeleteTask(item.id)} />)}
                    />
                </SafeAreaView>
                <CustomButton
                    onPress={() => navigation.navigate(ScreenName.addTask)}
                    label={'Add task'} />
            </View>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    mainContentContainer: {
        //  backgroundColor: 'red',
        height: '100%',
        position: 'absolute',
        padding: 20,
        width: Dimensions.get('screen').width,
    },
    headerContainer: {
        marginBottom: 10
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.text.primary
    },


})