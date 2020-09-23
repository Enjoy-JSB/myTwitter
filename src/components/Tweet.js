import { dbService, storageService } from "myBase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    console.log(ok);
    if (ok) {
      await dbService.doc(`tweets/${tweetObj.id}`).delete();
      await storageService.refFromURL(tweetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`tweets/${tweetObj.id}`).update({ text: newTweet });
    toggleEditing();
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  return (
    <>
      <span>{tweetObj.creatorName || "익명"}</span>
      <div className="nweet" style={{ marginTop: "10px" }}>
        {editing ? (
          <>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                placeholder="트윗을 수정하세요"
                value={newTweet}
                onChange={onChange}
                required
                className="formInput"
              />
              <input type="submit" value="트윗 업데이트" className="formBtn" />
            </form>
            <button onClick={toggleEditing} className="formBtn cancelBtn">
              취소
            </button>
          </>
        ) : (
          <>
            <h4>{tweetObj.text}</h4>
            {tweetObj.attachmentUrl && (
              <img src={tweetObj.attachmentUrl} width="50px" height="50px" />
            )}
            {isOwner && (
              <div class="nweet__actions">
                <span onClick={onDeleteClick}>
                  <FontAwesomeIcon icon={faTrash} />
                </span>
                <span onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Tweet;
