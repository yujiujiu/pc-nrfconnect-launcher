/* eslint-disable import/first */

// Do not render react-bootstrap components in tests
jest.mock('../ConfirmationDialog', () => 'ConfirmationDialog');

import React from 'react';
import renderer from 'react-test-renderer';
import FirmwareDialog from '../FirmwareDialog';

describe('FirmwareDialog', () => {
    it('should render empty div if not visible', () => {
        expect(renderer.create(
            <FirmwareDialog
                isVisible={false}
                onCancel={() => {}}
                onConfirmUpdateFirmware={() => {}}
            />,
        )).toMatchSnapshot();
    });

    it('should render visible dialog with default text for given port', () => {
        expect(renderer.create(
            <FirmwareDialog
                isVisible
                port={{
                    comName: '/dev/tty1',
                    serialNumber: '1337',
                }}
                onCancel={() => {}}
                onConfirmUpdateFirmware={() => {}}
            />,
        )).toMatchSnapshot();
    });

    it('should render visible dialog with custom text', () => {
        expect(renderer.create(
            <FirmwareDialog
                isVisible
                text="Do you confirm?"
                onCancel={() => {}}
                onConfirmUpdateFirmware={() => {}}
            />,
        )).toMatchSnapshot();
    });
});