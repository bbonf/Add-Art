set x=%cd%
set zf="%PROGRAMFILES%\7-Zip"

echo "cleaning up"
del addart-build.xpi
del addart.xpi

echo %x%
echo "Duplicating..."
xcopy /s /I addart addart_working
cd addart_working


echo "zippin"
cd chrome
%zf%\7z a -tzip "addart.jar" * -r -mx=0
rmdir content /S /Q
rmdir skin /S /Q

cd ..
%zf%\7z a -tzip "addart-build.xpi" * -r -mx=9
move addart-build.xpi ../.

cd ..
rmdir addart_working /S /Q

%zf%\7z a -tzip "addart.xpi" *.xpi install.rdf -mx=9
del addart-build.xpi
