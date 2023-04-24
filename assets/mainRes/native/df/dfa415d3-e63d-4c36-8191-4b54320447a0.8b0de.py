import json
import os
import plistlib
import shutil
from ast import literal_eval
import os
os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
import pygame
import tinify
from PIL import Image

tinify.key = "T6Pfv6BXc2lFnJhssTJ8DwBTXzgvDRHR"  # API KEY


class FileUtils:

    def uuid2uuid(self, base64):
        BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
        BASE64_VALUES = [0 for i in range(123)]
        for i in range(123):
            BASE64_VALUES[i] = 64
        for i in range(64):
            BASE64_VALUES[ord(BASE64_KEYS[i])] = i
        Base64Values = BASE64_VALUES
        HexChars = "0123456789abcdef"
        _t = ["", "", "", ""]
        _tt = ["-"]
        UuidTemplate = _t + _t + _tt + _t + _tt + _t + _tt + _t + _tt + _t + _t + _t
        Indices = []
        _index = 0
        for v in UuidTemplate:
            if v == "":
                Indices.append(_index)
            _index += 1
        if len(base64) != 22:
            return base64
        UuidTemplate[0] = base64[0]
        UuidTemplate[1] = base64[1]
        i = 2
        j = 2
        while i < 22:
            lhs = Base64Values[ord(base64[i])]
            rhs = Base64Values[ord(base64[i + 1])]
            UuidTemplate[Indices[j]] = HexChars[lhs >> 2]
            j += 1
            UuidTemplate[Indices[j]] = HexChars[((lhs & 3) << 2) | rhs >> 4]
            j += 1
            UuidTemplate[Indices[j]] = HexChars[rhs & 0xF]
            j += 1
            i += 2
        return "".join(UuidTemplate)

    '''
    该函数是拷贝文件的批处理
    '''

    def copyFiles(self, srcDir=os.path.abspath((os.path.dirname(__file__))), outDir="out"):
        print("copy files==>srcDir:%s" % srcDir)
        current_dir = os.path.abspath((os.path.dirname(__file__)))
        tmpOutPath = os.path.join(current_dir, outDir)
        if not os.path.exists(tmpOutPath):
            os.makedirs(tmpOutPath)
        for root, dirs, files in os.walk(srcDir):
            if root != tmpOutPath:
                for file in files:
                    srcFile = os.path.join(root, file)
                    destFile = os.path.join(tmpOutPath, file)
                    if srcFile != destFile and not srcFile.endswith(".py"):
                        print("srcFile:%s, destFile:%s" % (srcFile, destFile))
                        shutil.copy2(srcFile, destFile)
                    elif srcFile == destFile:
                        print("copy the same file")
                    else:
                        print("copy .py file")

    '''
    该函数是重新刷新plist
    '''

    def updatePlist(self, current_dir=os.path.abspath(os.path.dirname(__file__))):
        for root, dirs, files in os.walk(current_dir):
            # 遍历文件
            for f in files:
                filePath = os.path.join(root, f)
                file_f = os.path.splitext(f)
                filename, ftype = file_f
                if ftype == ".plist":
                    fname = filename
                    print('filePath:{filePath}')
                    pdict = plistlib.readPlist(filePath)
                    src_pic = os.path.join(root, filename + ".png")
                    old_pic = os.path.join(root, filename + "_copy.png");
                    if os.path.exists(src_pic):
                        img = Image.open(src_pic)
                        if os.path.exists(old_pic):
                            os.remove(old_pic)
                        newImg = Image.new('RGBA', (img.width, img.height), (0, 0, 0, 0))
                        frames = pdict["frames"]
                        for name in frames:
                            nFile = os.path.join(root, name)
                            tmpFileName, tmpType = os.path.splitext(name);
                            copyFile = os.path.join(root, f'{tmpFileName}_bk{tmpType}')
                            if os.path.exists(nFile):
                                sPic = Image.open(nFile)
                                info = frames[name]
                                print(f'info==>{info}')
                                print(info['textureRect'], type(info['textureRect']))
                                rotated = info['textureRotated']
                                tmpOffset = info['spriteOffset']
                                tmpOffset = tmpOffset.replace("{", "")
                                tmpOffset = tmpOffset.replace("}", "")
                                tmpOffset = f'[{tmpOffset}]'
                                offset = literal_eval(tmpOffset)
                                tmpOriginalSize = info['spriteSourceSize']
                                tmpOriginalSize = tmpOriginalSize.replace("{", "")
                                tmpOriginalSize = tmpOriginalSize.replace("}", "")
                                tmpOriginalSize = f"[{tmpOriginalSize}]"
                                originalSize = literal_eval(tmpOriginalSize)
                                tmpRect = info['textureRect']
                                tmpRect = tmpRect.replace("{", "")
                                tmpRect = tmpRect.replace("}", "")
                                tmpRect = f"[{tmpRect}]"
                                rect = literal_eval(tmpRect)
                                print(f'rect:{rect}, originalSize:{originalSize}, offset:{offset}, rotated:{rotated}')
                                box = (rect[0], rect[1], rect[0] + (rect[2] if not rotated else rect[3]),
                                       rect[1] + (rect[3] if not rotated else rect[2]))
                                box = (rect[0], rect[1], rect[0] + rect[2], rect[1] + rect[3])
                                if name == "common_logo_suduku.png":
                                    i = 0
                                offx = originalSize[0] / 2 - offset[0] - rect[2] / 2
                                offy = originalSize[1] / 2 - offset[1] - rect[3] / 2
                                box = (offx, offy, offx + rect[2], offy + rect[3])
                                boxCopy = sPic.crop(box)
                                '''                                
                                boxCopy.save(copyFile, optimize=True, quality=100)
                                if os.path.exists(copyFile):
                                    os.remove(copyFile)
                                '''
                                if rotated:
                                    boxCopy = boxCopy.transpose(Image.ROTATE_270)
                                    print(f'new===>w:{boxCopy.width}, h:{boxCopy.height}')

                                print(f'offx:{offx}, offy:{offy}')
                                newImg.paste(boxCopy, (int(rect[0]), int(rect[1])))
                        os.rename(src_pic, old_pic)
                        newImg.save(src_pic, optimize=True, quality=100)
                        os.remove(old_pic)
                    else:
                        print(f"have not plist:{filename}' pic")

    '''
    该函数的数字转为图片，直接用字库绘画，生成图片
    '''

    def wordToPic(self, words={0, 1, 2, 3, 4, 5, 6, 7, 8, 9},
                  outPath=os.path.join(os.path.dirname(__file__), "picOut")):
        print(os.path.dirname(__file__))
        currentPath = os.path.dirname(__file__)
        out_dir = outPath
        if not os.path.exists(out_dir):
            os.mkdir(out_dir)

        pygame.init()
        for codepoint in words:
            name = str(codepoint)
            word = name.encode('utf-8')
            penFont = pygame.font.Font("RedHatText-Medium.ttf", 30)
            penFont = pygame.font.Font(os.path.join(currentPath, "MSYH.TTC"), 100)
            font = pygame.font.Font(os.path.join(currentPath, "RedHatText-Regular.ttf"), 100)
            # font = pygame.font.Font("Roboto-Thin.ttf", 100)
            # 当前目录下要有微软雅黑的字体文件msyh.ttc,或者去c:\windows\fonts目录下找
            # 64是生成汉字的字体大小
            # 387438
            # (142, 91, 41)黄色
            # (218, 122, 55)ColorNumDartYellow
            # (250, 223, 76)ColorNumWarnYellow
            # (255, 0, 0)ColorNumRed
            # (250, 250, 250)ColorGridWhite
            # (58, 130, 45)绿色

            # (70,92,133) 蓝色
            # (213， 60， 161) 红色
            # (220. 220. 220) 白色
            # (100, 100, 100) 黑色

            rPenText = penFont.render(word, (0, 0, 0), (48, 48, 48))
            pygame.image.save(rPenText, os.path.join(out_dir, 'grid_pen_' + name + ".png"))

            colors = [(70, 92, 133), (213, 60, 161), (220, 220, 220), (48, 48, 48)]
            names = ['grid_num_green_', 'grid_num_red_', 'grid_num_white_', 'grid_num_black_']

            for i in range(len(colors)):
                rtext = font.render(word, (0, 0, 0), colors[i])
                pygame.image.save(rtext, os.path.join(out_dir, names[i] + name + ".png"))

            # pygame.image.save(rtext, os.path.join(out_dir, "grid_num_black_" + name + ".png"))

    '''
    该函数是把图片前面的增加命名
    '''

    def renameFiles(self, currentDir=os.path.abspath(os.path.dirname(__file__)), outPath="fileOut", bPic=True):
        head = input("请输入要添加在前面的文件名")
        outPath = currentDir.join(outPath)
        for root, dirs, files in os.walk(currentDir):
            # 遍历文件
            for f in files:
                filePath = os.path.join(root, f)
                file_f = os.path.splitext(f)
                filename, ftype = file_f
                if bPic != True or (ftype == ".png" or ftype == ".jpg"):
                    fname = filename
                    print('filePath:{filePath}')
                    src_pic = filePath
                    dest_pic = head + f;
                    dest_pic = os.path.join(outPath, dest_pic)
                    shutil.copy2(src_pic, dest_pic)

    # 压缩的核心
    def compress_core(self, inputFile, outputFile, img_width):
        source = tinify.from_file(inputFile)
        if img_width is not -1:
            resized = source.resize(method="scale", width=img_width)
            resized.to_file(outputFile)

    # 压缩一个文件夹下的图片
    def compress_path(self, path, width=-1):
        print("compress_path-------------------------------------")
        if not os.path.isdir(path):
            print("这不是一个文件夹，请输入文件夹的正确路径!")
            return
        else:
            fromFilePath = path  # 源路径
            # toFilePath = path+"/tiny" 		# 输出路径
            toFilePath = path  # 输出路径
            print("fromFilePath=%s" % fromFilePath)
            print("toFilePath=%s" % toFilePath)

            for root, dirs, files in os.walk(fromFilePath):
                print("root = %s" % root)
                print("dirs = %s" % dirs)
                print("files= %s" % files)
                for name in files:
                    fileName, fileSuffix = os.path.splitext(name)
                    if fileSuffix == '.png' or fileSuffix == '.jpg' or fileSuffix == '.jpeg':
                        toFullName = os.path.join(root, fileName + "_bak" + fileSuffix)
                        fromFullName = os.path.join(root, name)
                        self.compress_core(fromFullName, toFullName, width)
                        os.remove(fromFullName)
                        os.rename(toFullName, fromFullName)

    # 仅压缩指定文件
    def compress_file(self, inputFile, width=-1):
        print("compress_file-------------------------------------")
        if not os.path.isfile(inputFile):
            print("这不是一个文件，请输入文件的正确路径!")
            return
        print("file = %s" % inputFile)
        dirname = os.path.dirname(inputFile)
        basename = os.path.basename(inputFile)
        fileName, fileSuffix = os.path.splitext(basename)
        if fileSuffix == '.png' or fileSuffix == '.jpg' or fileSuffix == '.jpeg':
            self.compress_core(inputFile, dirname + "/tiny_" + basename, width)
        else:
            print("不支持该文件类型!")

    ''''
    该函数是获取骨骼动画
    '''

    def getSkeleton(self, current_dir, our_fir):
        for root, dirs, files in os.walk(current_dir):
            # 遍历文件
            for f in files:
                filePath = os.path.join(root, f)
                file_f = os.path.splitext(f)
                filename, ftype = file_f
                # print(file_f)
                if ftype == ".json" and 'config' not in filename:
                    json_file = open(filePath, encoding='utf-8')
                    text = json_file.read()
                    json_obj = json.loads(text)
                    # print(json_obj)

                    if "sp.SkeletonData" in text and "skeleton" in text:
                        name = json_obj[5][0][1]
                        atlas = json_obj[5][0][2]
                        skeleton = json_obj[5][0][4]
                        uuid = json_obj[1][0]
                        fatlas = open(our_fir + name + ".atlas", mode='w')  # , encoding='utf-8')
                        fatlas.write(atlas)
                        fatlas.close();
                        fjson = open(our_fir + name + ".json", mode='w')  # , encoding='utf-8')
                        fjson.write(json.dumps(skeleton))
                        fjson.close()
                        uuid = self.uuid2uuid(uuid)
                        temp_dir = os.path.abspath(os.path.dirname(__file__))
                        fi_dir = os.path.join(temp_dir, "native")
                        fi_dir = os.path.join(fi_dir, uuid[:2])
                        uuidPng = os.path.join(fi_dir, uuid + ".png")
                        newPng = os.path.join(our_fir, name + ".png");
                        if os.path.exists(uuidPng):
                            shutil.copy(uuidPng, newPng)
                        else:
                            print(f'not exists png is {uuidPng}')

    '''
    获取文件路径, type==0图片， type==1，prefabs
    '''

    def getFilePath(self, currentPath=os.path.dirname(__file__), type=0):
        print("getFilePath====>currentPath"+currentPath)
        outFile = os.path.join(currentPath, 'out')
        if not os.path.exists(outFile):
            os.makedirs(outFile)
        outFile = os.path.join(outFile, "names.txt")
        myFile = open(outFile, "wb")
        print("getFilePath====>111111")
        for root, dirs, files in os.walk(currentPath):
            print("getFilePath====>222222")
            for file in files:
                print("file:"+file)
                filePath = os.path.join(root, file)
                fileName, fileType = os.path.splitext(file)
                if (type == 0 and (fileType == '.jpg' or fileType == '.png' or fileType == '.jpeg')) or (
                        type == 1 and fileType == '.prefab'):
                    if filePath.find("mainRes/") != -1:
                        paths = filePath.split("mainRes/")
                        filePath = "mainRes/" + paths[1]
                    elif filePath.find("resource/") != -1:
                        paths = filePath.split("resource/")
                        filePath = paths[1]
                    filePath = filePath.replace(fileType, "")
                    print("filePath===>", filePath)
                    filePath = f'"{filePath}"' + ',\n'
                    filePath = filePath.encode(encoding='utf-8')
                    myFile.write(filePath)


utils = FileUtils()
# utils.copyFiles()
# utils.updatePlist()
#utils.wordToPic()
utils.getFilePath(currentPath=os.getcwd(), type=1)
