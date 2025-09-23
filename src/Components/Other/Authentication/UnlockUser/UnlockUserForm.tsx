import React, { useState } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, } from 'reactstrap';
import { EnterYourPassword, RememberPassword, SignIn, Unlock } from '@/Constant';
import { UnlockIcon } from '@/Data/Pages/PagesSvgIcons';
import Link from 'next/link';

export default function UnlockUserForm() {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const toggle = () => setPasswordVisible(!isPasswordVisible);
    const [formData, setFormData] = useState({ password: '', checkbox1: false, });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { id, value, type, checked } = e.target;
        setFormData((prevData) => ({...prevData,[id]: type === 'checkbox' ? checked : value,}));
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {e.preventDefault();setFormData({ password: '', checkbox1: false, });};

    return (
        <Form className="theme-form" onSubmit={handleSubmit}>
            <h2 className="mb-0">{Unlock}</h2>
            <FormGroup><UnlockIcon /></FormGroup>
            <FormGroup>
                <Col><Label>{EnterYourPassword}</Label></Col>
                <div className="form-input position-relative">
                    <Input type={isPasswordVisible ? 'text' : 'password'} id="password" name="login[password]" required placeholder="*********" value={formData.password} onChange={handleInputChange} />
                    <div className='show-hide' onClick={toggle}><span className={!isPasswordVisible ? 'show' : ''}></span></div>
                </div>
            </FormGroup> 
            <FormGroup className="mb-0 checkbox-checked">
                <FormGroup className="checkbox-solid-info" check>
                    <Input id="solid6" type="checkbox" name='checked' onChange={handleInputChange} />
                    <Label htmlFor="solid6" check>{RememberPassword}</Label>
                </FormGroup>
                <Button color='primary' className="w-100 mt-3" block>{Unlock}</Button>
            </FormGroup>
            <p className="mt-4 mb-0">{"Already have an account?"}
                <Link href={`/others/authentication/loginsimple`} className='ms-2'>{SignIn}</Link>
            </p>
        </Form>
    )
}