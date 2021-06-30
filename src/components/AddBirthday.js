import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import firebase from '../utils/firebase';
import 'firebase/firestore';

firebase.firestore().settings({experimentalForceLongPolling: true})
const db = firebase.firestore(firebase);

export default function AddBirthday(props) {
    const { user, setShowList, setReloadData } = props;
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [ formData, setFormData ] = useState({});
    const [formError, setFormError] = useState({});

    const hideDatePicker = () => {
        setIsDatePickerVisible(false);
    };

    const handlerConfirm = (fecha) => {
        const dateBirth = fecha;
        dateBirth.setHours(0);
        dateBirth.setMinutes(0);
        dateBirth.setSeconds(0);
        setFormData({...formData, dateBirth})
        hideDatePicker();
    };

    const showDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e});
    };

    const onSubmit = () => {
        let errors = {};
        if (!formData.name || !formData.lastname || !formData.dateBirth) {
            if (!formData.name) errors.name = true;
            if (!formData.lastname) errors.lastname = true;
            if (!formData.dateBirth) errors.dateBirth = true;
        } else {
            const data = formData;
            data.dateBirth.setYear(0);
            db.collection(user.uid)
            .add(data)
            .then(() => { setShowList(true); setReloadData(true)})
            .catch(() => { setFormError({name: true, lastname: true, dateBirth: true})})
        }
        setFormError(errors);
    };

    return(
        <>
            <View style={styles.container}>
                <TextInput
                style={[styles.input, formError.name && {borderColor: '#940c0c'}]}
                    placeholder='Nombre'
                    placeholderTextColor='#969696'
                    onChangeText={(e) => onChange(e, 'name')}>
                </TextInput>
                <TextInput
                style={[styles.input, formError.lastname && {borderColor: '#940c0c'}]}
                    placeholder='Apellidos'
                    placeholderTextColor='#969696'
                    onChangeText={(e) => onChange(e, 'lastname')}>
                </TextInput>
                <View style={[styles.input, styles.datepicker, formError.dateBirth && {borderColor: '#940c0c'}]}>
                    <Text style={{color: formData.dateBirth ? '#fff' : '#969696', fontSize: 18}} onPress={showDatePicker}>
                        {formData.dateBirth ? moment(formData.dateBirth).format('LL') : 'Fecha de nacimiento'}
                    </Text>
                </View>
                <TouchableOpacity onPress={onSubmit}>
                    <Text style={styles.addButton}>Crear cumpleaños</Text>
                </TouchableOpacity>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode='date'
                onConfirm={handlerConfirm}
                onCancel={hideDatePicker}
            ></DateTimePickerModal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 50,
        color: '#fff',
        width: '80%',
        marginBottom: 25,
        backgroundColor: '#1e3040',
        paddingHorizontal: 20,
        paddingRight: 50,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#1e3040',
        borderRadius: 50
    },
    datepicker: {
        justifyContent: 'center'
    },
    addButton: {
        fontSize: 18,
        color: '#fff'
    }
});