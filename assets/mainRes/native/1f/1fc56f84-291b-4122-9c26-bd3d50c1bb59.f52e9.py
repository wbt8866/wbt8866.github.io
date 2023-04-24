#!/usr/bin/env python
# -*- coding:utf-8 -*-
#导出资源

import imp
from pathlib import Path
from pickletools import optimize
from posixpath import split
from re import S
import urllib.request 
import zipfile
import sys
import os
import shutil
import json
import types

from xml.dom.minidom import parseString
from PIL import Image, ImageDraw

#from numpy import array
'''
def unzip_file(zfile_path, unzip_dir):
    
    #function:解压
    #params:
    #    zfile_path:压缩文件路径
    #    unzip_dir:解压缩路径
    #description:
    
    try:
        with zipfile.ZipFile(zfile_path) as zfile:
            zfile.extractall(path=unzip_dir)
    except zipfile.BadZipFile as e:
        print (zfile_path+" is a bad zip file ,please check!")

def download(url, localFileName = None):
    req = urllib.request.urlretrieve(url,localFileName)


def copy_dir(src_dir,des_dir):
    for name in os.listdir(src_dir):
        new_path = os.path.join(src_dir,name)
        try:
            shutil.copy(new_path, des_dir)
        except IOError as e:
            print("Unable to copy file. %s" % e)
        except:
            print("Unexpected error:", sys.exc_info())
'''

pics = {}
atlas = {}

def dict_to_xml(dict_in, xml_out):
    xml_str = dict2xml.dict2xml(dict_in)
    return xml_str
    


def walkPics(current_dir,our_fir):
    tmpOutPath = our_fir+f'/../out/'
    if not os.path.exists(tmpOutPath):
        os.makedirs(tmpOutPath)
    outFile = tmpOutPath+"names.txt"
    myFile =  open(outFile, "wb")
    
    for root, dirs, files in os.walk(current_dir):
        # 遍历文件
        for f in files:
            filePath = os.path.join(root, f)
            file_f = os.path.splitext(f)
            filename,ftype = file_f
            idx = filePath.index("mainRes")
            headStr = ""
            if idx!=-1:
                headStr = filePath[:idx]
            
            #print(file_f)
            if ftype== ".png" or ftype=='.jpg':
                if headStr:
                    filePath = filePath.replace(headStr, "")
                else:
                    filePath = filePath.replace(our_fir+"/", "")
                filePath = filePath.replace(ftype, "")
                print("filePath===>", filePath)
                filePath = f'"{filePath}/spriteFrame"' + ',\n'
                filePath = filePath.encode(encoding='utf-8')
                myFile.write(filePath)

    myFile.close()

current_dir = os.path.abspath(os.path.dirname(__file__))
print(current_dir)
tmpOutPath = current_dir+f'/../out/'
if not os.path.exists(tmpOutPath):
    os.makedirs(tmpOutPath)
walkPics(current_dir,current_dir)