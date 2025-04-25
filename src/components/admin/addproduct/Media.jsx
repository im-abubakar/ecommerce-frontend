import React from 'react';
import Image from 'next/image';

const Media = ({ formData, handleChange, errors }) => {
  return (
    <section>
      <h2 className="mb-4 fs-4 fs-md-3 border-bottom pb-2">Media</h2>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Main Product Image*</label>
          <input
            type="file"
            className={`form-control ${errors.img ? 'is-invalid' : ''}`}
            name="img"
            onChange={handleChange}
            accept="image/*"
            required
          />
          {errors.img && <div className="invalid-feedback">{errors.img}</div>}
          {formData.img && (
            <div className="mt-2">
              <Image
                src={URL.createObjectURL(formData.img)} // temporary URL for preview
                alt="Preview"
                className="img-thumbnail"
                style={{ maxHeight: '150px' }}
                width={150} // set a width and height to avoid layout shifts
                height={150}
              />
              <div className="text-muted small mt-1">{formData.img.name}</div>
            </div>
          )}
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Video ID (YouTube)</label>
          <input
            type="text"
            className="form-control"
            name="videoId"
            value={formData.videoId}
            onChange={handleChange}
            placeholder="YouTube video ID"
          />
        </div>
      </div>
    </section>
  );
};

export default Media;
