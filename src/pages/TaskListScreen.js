import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import colors from '../themes/Colors'
import CustomTextInput from '../components/CustomTextInput'
import SearchIcon from '../assets/images/SearchIcon.png'
import { FlatList } from 'react-native-gesture-handler'
import TodoItem from '../components/TodoItem'


export default function TaskListScreen() {

    //! customtextInputa girdiğimiz verileri almak için state tutuyoruz
    const [searchText, setSearchText] = useState('');
    console.warn(searchText);

    //! liste yapısı oluşturmak için kullandığımız usestate
    const [tasks, setTasks] = useState([
        {
            userId: 4,
            id: 4,
            title: 'title',
            status: 'closed',
        },
        {
            userId: 5,
            id: 5,
            title: 'title',
            status: 'closed',
        },
        {
            userId: 6,
            id: 6,
            title: 'title',
            status: 'closed',
        },

    ]);



    return (
        <View style={styles.container}>
            <View style={styles.mainContentContainer}>
                <SafeAreaView style={[styles.container, { marginBottom: 20 }]}>
                    <CustomTextInput
                        value={searchText}
                        onChange={setSearchText}
                        imageSource={SearchIcon}
                        style={{ margiHorizontal: 0 }}
                        placeHolder='Task ara'
                    />
                    <FlatList data={tasks} renderItem={({ item }) => <TodoItem data={item} />} />
                </SafeAreaView>
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
    }

})