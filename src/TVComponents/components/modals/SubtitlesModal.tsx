import React,{ useEffect } from 'react';
import { Button } from '../../design-system/components/Button';
import { Spacer } from '../../design-system/components/Spacer';
import { GenericModal } from './GenericModal';
import { useIsFirstRender } from './useIsFirstRender';
import {SpatialNavigationRoot,useLockSpatialNavigation, DefaultFocus } from 'react-tv-space-navigation';

interface SubtitlesModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (isVisible: boolean) => void;
  setSubtitles: (subtitles: string) => void;
}

export const SubtitlesModal = ({
  isModalVisible,
  setIsModalVisible,
  setSubtitles,
}: SubtitlesModalProps) => {
  const { lock, unlock } = useLockSpatialNavigation();
  const isFirstRender = useIsFirstRender();

  // Locks the parent navigator when the modal is open and unlocks it when it's closed
  useEffect(() => {
    if (!isFirstRender) {
      if (isModalVisible) {
        lock();
      } else {
        unlock();
      }
    }
  }, [isModalVisible, lock, unlock, isFirstRender]);

  return (
    <SpatialNavigationRoot>
      <GenericModal isVisible={isModalVisible} title={'Choose subtitles'}>
        <DefaultFocus>
          <Button
            label="English"
            onSelect={() => {
              setSubtitles('English');
              setIsModalVisible(false);
            } } type={''}          />
        </DefaultFocus>
        <Spacer gap="$8" />
        <Button
          label="Spanish"
          onSelect={() => {
            setSubtitles('Spanish');
            setIsModalVisible(false);
          } } type={''}        />
        <Spacer gap="$8" />
        <Button
          label="Portuguese"
          onSelect={() => {
            setSubtitles('Portuguese');
            setIsModalVisible(false);
          } } type={''}        />
        <Spacer gap="$8" />
        <Button
          label="None"
          onSelect={() => {
            setSubtitles('No');
            setIsModalVisible(false);
          } } type={''}        />
      </GenericModal>
    </SpatialNavigationRoot>
  );
};