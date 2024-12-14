"use client"

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Form,
} from "@nextui-org/react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

export default function SignIn() {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleSubmit = async (formData: FormData) => {

        const username = formData.get("username") as string; // Access form fields
        const password = formData.get("password") as string;

        const response = await signIn("credentials", {
            redirect: false,
            username: username,
            password: password,
        });

        if (response?.error) {
            toast.error(response?.error)
        } else {
            toast.success("สำเร็จ");
        }
    }

    return (
        <>
            <Button onPress={onOpen} radius="sm" color="warning" size="md" className="text-[16px] font-semibold">
                เข้าสู่ระบบ
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เข้าสู่ระบบ</ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full flex flex-col gap-4 mb-4"
                                    validationBehavior="native"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        handleSubmit(new FormData(e.currentTarget));
                                    }}
                                >
                                    <Input
                                        isRequired
                                        label="ชื่อผู้ใช้งาน"
                                        labelPlacement="outside"
                                        name="username"
                                        type="text"
                                        variant="bordered"
                                        placeholder="กรอกชื่อผู้ใช้งาน"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />

                                    <Input
                                        isRequired
                                        label="รหัสผ่าน"
                                        labelPlacement="outside"
                                        name="password"
                                        type="password"
                                        variant="bordered"
                                        placeholder="กรอกรหัสผ่าน"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                    <div className="w-full">
                                        <Button color="primary" type="submit" radius="sm" className="w-full">
                                            เข้าสู่ระบบ
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
