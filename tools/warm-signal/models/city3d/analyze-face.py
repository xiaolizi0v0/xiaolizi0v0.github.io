"""Read an original PNG and export face-region metadata for mesh assignment.

No image is edited or saved. Coordinates describe the largest upper-body skin
component, with interior eye/mouth holes included, for geometry material labels.
"""
import argparse,hashlib,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy import ndimage
p=argparse.ArgumentParser();p.add_argument('--source',type=Path,required=True);p.add_argument('--output',type=Path,required=True)
a=p.parse_args();assert not a.output.exists()
rgba=np.asarray(Image.open(a.source).convert('RGBA'));rgb=rgba[:,:,:3]/255;alpha=rgba[:,:,3]>127
yy,xx=np.where(alpha);bounds=[int(xx.min()),int(yy.min()),int(xx.max())+1,int(yy.max())+1]
height=bounds[3]-bounds[1];v=(bounds[3]-np.arange(rgba.shape[0]))/height
skin=(rgb[:,:,0]>.84)&(rgb[:,:,1]>.53)&(rgb[:,:,2]>.36)&alpha&((v>.52)&(v<.9))[:,None]
labels,count=ndimage.label(skin);sizes=np.bincount(labels.ravel());sizes[0]=0;largest=int(sizes.argmax())
mask=ndimage.binary_fill_holes(labels==largest)
for label in range(1,count+1):
    if label==largest or sizes[label]<sizes[largest]*.005:continue
    rows=np.where(labels==label)[0]
    if v[rows].mean()<.71:mask|=ndimage.binary_fill_holes(labels==label)
runs=[]
for y,row in enumerate(mask):
    transitions=np.diff(np.pad(row.astype(np.int8),(1,1)));starts=np.where(transitions==1)[0];ends=np.where(transitions==-1)[0]
    runs.extend([[y,int(start),int(end)] for start,end in zip(starts,ends)])
report={'source':str(a.source),'SHA256':hashlib.sha256(a.source.read_bytes()).hexdigest(),'size':[rgba.shape[1],rgba.shape[0]],
        'boundsTopLeft':bounds,'coordinateOrigin':'top-left','facePixels':int(mask.sum()),'faceRuns':runs}
a.output.write_text(json.dumps(report,separators=(',',':')),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='faceRuns'}))
