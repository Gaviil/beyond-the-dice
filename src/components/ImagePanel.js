import React, {useEffect, useState} from 'react';
import i18next from 'i18next';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { toast } from 'react-toastify';

const ImagePanel = ({campaignUid, characterUid}) => {
  
  const [urlImage, setUrlImage] = useState('');
  const [memberAvailable, setMemberAvailable] = useState([]);

  useEffect(() => {
    if(campaignUid) {
      const dbRefObject = firebase.database().ref('imagePanel').child(`${campaignUid}`);
      dbRefObject.on('value', snap => {
        if(snap.val()) {
          setUrlImage(snap.val().url)
          setMemberAvailable(snap.val().memberAvailable)
        }
      });
    }
  }, [campaignUid]);

  return (
    <div className='containerImagePanel'>
      <div className='panelContent' style={{height: window.innerHeight - 180}}>
          {memberAvailable.includes(characterUid) && (
            <img src={urlImage} alt='panelImage'/>
          )}
      </div>
    </div>
  );
  
}

export const ImagePanelAdmin = ({campaignUid, company}) => {
  const [image, setImage] = useState(null);
  const [urlImage, setUrlImage] = useState('');
  const [selectedCharacter, setSelectedCharacter] = useState([]);
  const [selectedCharacterSaved, setSelectedCharacterSaved] = useState([]);

  useEffect(() => {
    if(campaignUid) {
      const dbRefObject = firebase.database().ref('imagePanel').child(`${campaignUid}`);
      dbRefObject.on('value', snap => {
        if(snap.val()) {
          setUrlImage(snap.val().url)
          setSelectedCharacterSaved(snap.val().memberAvailable)
        }
      });
    }
  },[campaignUid]);
  
  useEffect(() => {
    let memberSelected = [];
    for(let i=0; i<selectedCharacterSaved.length; i+=1) {
      memberSelected.push(selectedCharacterSaved[i]);
    }
    setSelectedCharacter(memberSelected);
  }, [selectedCharacterSaved]);

  const handleUpload = async () => {
    if(image && image.size < 800000){
      const uploadTask = firebase.storage().ref(`panel/${campaignUid}.png`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {},
        error => {
          console.log(error);
        },
        async () => {
          await firebase.storage()
            .ref("panel")
            .child(`${campaignUid}.png`)
            .getDownloadURL()
            .then(url => {
              setUrlImage(url);
              firebase.database().ref('imagePanel').child(`${campaignUid}`).set({
                url: url,
                memberAvailable: selectedCharacter
              });
            });
        }
      );
    } else {
      console.log('to big picture');
      toast.error(i18next.t('illustration.sizeMax'), {});
    }
  };

  const handleChange = async (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className='imagePanelAdminContainer'>
      <div className='addImagePanel'>
        <form
          onSubmit={ async (e) => {
            if(image && selectedCharacter.length) {
              try {
                await handleUpload();
              }
              catch (error) {
                console.log('error',error)
              }
            } else {
              toast.warning('IMAGE OR MEMBER MANDATORY', {});
            }
            e.preventDefault();
          }}
        >
          <h2>{i18next.t('illustration.formTittle')}</h2>
          <span className='guide'>{i18next.t('illustration.guideDm')}</span>
          <label>
            <input type="file" name="file" id="file" className="inputfile" onChange={handleChange} />
            <label htmlFor="file">{image ? image.name : i18next.t('choose a file')}</label>
          </label>
          <div className='configPanel'>
            <span onClick={() => {
              let memberListToDisplay = [];
              for(let i=0; i<company.length; i+=1) {
                memberListToDisplay.push(company[i].uid);
              }
              setSelectedCharacter(memberListToDisplay);
            }}>
              {i18next.t('selectAll')}
            </span>
            <span onClick={() => {
              setSelectedCharacter([]);
            }}>
              {i18next.t('removeAll')}
            </span>
            {company.map((member) => (
              <span
                className={selectedCharacter.includes(member.uid) ? 'selectedUser' : ''}
                onClick={() => {
                  let memberListToDisplay = [...selectedCharacter];
                  if(memberListToDisplay.includes(member.uid)) {
                    memberListToDisplay.splice(memberListToDisplay.findIndex((memberId) => (
                      member.uid === memberId
                    )), 1);
                    setSelectedCharacter(memberListToDisplay);
                  } else {
                    memberListToDisplay.push(member.uid);
                    setSelectedCharacter(memberListToDisplay);
                  }
              }}>
                {member.name}
              </span>
            ))}
          </div>
          <input type="submit" value={i18next.t('send')} />
        </form>
      </div>
      <div className='panelContent' style={{height: window.innerHeight - 180}}>
          <img src={urlImage} alt=''/>
          <div className='infoUserDisplay'>
            {selectedCharacterSaved.map((characterId) => (
              <span>{company.filter((member) => (member.uid === characterId))[0].name}</span>
            ))}
          </div>
      </div>
    </div>
  );
  
}

export default ImagePanel