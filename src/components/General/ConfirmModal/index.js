import { Button, Modal } from 'antd';
import React, { useState } from 'react';
const ConfirmModal = ({visible,onCancel,text, confirmLoading,onOk,title}) => {

    return (
            <Modal
                visible={visible}
                onOk={onOk}
                confirmLoading={confirmLoading}
                onCancel={onCancel}
                closable={false}
                title={ title }
                centered={true}
            >
                <p>{text}</p>
            </Modal>
    );
};
export default ConfirmModal;