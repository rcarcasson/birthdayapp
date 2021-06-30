import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import {validateEmail} from '../utils/validatios';
import firebase from '../utils/firebase';

export default function RegisterForm(props) {
    const { changeForm } = props;
    const [formData, setFormData] = useState(defaultValue());
    const [formError, setFormError] = useState({});

    const register = () => {
        let errors = {};
        if(!formData.email || !formData.password || !formData.repeatPassword) {
            if(!formData.email) errors.email = true;
            if(!formData.password) errors.password = true;
            if(!formData.repeatPassword) errors.repeatPassword = true;
        } else if(!validateEmail(formData.email)) {
            errors.email = true;
        } else if(formData.password !== formData.repeatPassword) {
            errors.password = true;
            errors.repeatPassword = true;
        } else if(formData.password.length < 6) {
            errors.password = true;
        } else {
            firebase.auth()
            .createUserWithEmailAndPassword(formData.email, formData.password)
            .then(() => {})
            .catch(() => {
                setFormError({
                    email: true,
                    password: true,
                    repeatPassword: true
                });
            })
        }
        setFormError(errors);
    };

    return(
        <>
            <TextInput
                placeholder='Correo electrónico'
                placeholderTextColor='#969696'
                style={[styles.input, formError.email && styles.error]}
                onChangeText={(email) => setFormData({...formData, email: email})}
            ></TextInput>
            <TextInput
                style={[styles.input, formError.password && styles.error]}
                placeholder='Contraseña'
                placeholderTextColor='#969696'
                secureTextEntry={true}
                onChangeText={(password1) => setFormData({...formData, password: password1})}
            ></TextInput>
            <TextInput
                style={[styles.input, formError.repeatPassword && styles.error]}
                placeholder='Repetir contraseña'
                placeholderTextColor='#969696'
                secureTextEntry={true}
                onChangeText={(password2) => setFormData({...formData, repeatPassword: password2})}
            ></TextInput>
            <TouchableOpacity onPress={register}>
                <Text style={styles.btnText}>Registrate</Text>
            </TouchableOpacity>
            <View style={styles.login}>
                <TouchableOpacity onPress={changeForm}>
                    <Text style={styles.btnText}>Iniciar sesión</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

function defaultValue() {
    return {
        email: '',
        password: '',
        repeatPassword: ''
    }
}

const styles = StyleSheet.create({
    btnText: {
        color: '#fff',
        fontSize: 18,
    },
    input: {
        height: 50,
        color: '#fff',
        width: '80%',
        marginBottom: 25,
        backgroundColor: '#1e3040',
        paddingHorizontal: 20,
        borderRadius: 50,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#1e3040'
    },
    login: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    error: {
        borderColor: '#940c0c'
    }
});